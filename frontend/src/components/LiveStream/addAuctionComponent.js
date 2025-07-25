import React from "react";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression';
import logo from '../../assets/images/arlanta.svg';
import '../../styles/addAuction.scss';
class AddAuctionComponent extends React.Component {
    state = {
        currentFilePreview: null,
        currentFile: null,
        currentStartPrice: 0,
        isLoading: false,
        auction: [],

    }
    handleOnChangeFile = async (e) => {
        const acceptedTypes = ['image/png', 'image/jpeg'];
        const exceptionFile = e.target.files[0];
        if (!acceptedTypes.includes(exceptionFile.type)) {
            document.getElementsByClassName("file")[0].value = "";
            return toast.error(`File "${exceptionFile.name}" wrong format (only PNG or JPG)`, {
                toastId: "file-type-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                className: "toast-complete"
            });
        }
        const options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };
        const file = e.target.files[0];
        const compressedFile = await imageCompression(file, options);
        this.setState({
            currentFile: compressedFile,
            currentFilePreview: URL.createObjectURL(compressedFile)
        })
    }
    handleAddAuction = (image, startPrice) => {
        if (image === null) {
            toast.error("Please select an image and enter a start price.", {
                toastId: 'add-auction-error'
            });
            return;
        }
        if (this.state.auction) {
            this.setState((prevState) => ({
                auction: [...prevState.auction, { image, preview: URL.createObjectURL(image), startPrice }],
                currentFile: null,
                currentFilePreview: null,
                currentStartPrice: 0

            }));
        }
        else {
            this.setState({
                auction: { image, preview: URL.createObjectURL(image), startPrice },
                currentFile: null,
                currentFilePreview: null,
                currentStartPrice: 0

            });
        }
        document.getElementsByClassName("file")[0].value = "";
    }
    handleDeleteAuction = (index) => {
        this.setState((prevState) => {
            const auction = [...prevState.auction];
            auction.splice(index, 1);
            return { auction };
        });
    }
    handleSubmit = async () => {

        const { auction } = this.state;
        const formData = new FormData();

        auction.forEach((item, index) => {
            formData.append(`image_${index}`, item.image);
            formData.append(`startPrice_${index}`, item.startPrice);
        });
        formData.append("liveID", this.props.ID);
        formData.append("total", auction.length);
        // console.log("Form data prepared:", auction.length.toString());
        this.setState({
            isLoading: true,
        })
        try {
            const res = await fetch("http://localhost:9999/backend/api/live/auction/add", {
                method: "POST",
                body: formData,
                credentials: "include"
            });


            if (res.ok) {
                this.setState({
                    isLoading: false
                })
                toast.success("Add auction success");

            } else {
                toast.error("the auction must have image and price");
                this.setState({
                    isLoading: false
                })
            }
        } catch (error) {
            console.log("Server error!", error);
            toast.error("Cannot connect to the server.");
        }
        this.props.handleCloseForm();
    }
    render() {
        return (
            this.state.isLoading ?
                <div className="loading-container">
                    <span>Loading ... </span>
                    <img
                        src={logo}
                        alt="Loading..."
                        className="loading-spinner"
                    /></div>
                :
                <div className="add-auction-wrapped" onClick={() => this.props.handleCloseForm()}>
                    <div className="add-auction-form" onClick={(e) => e.stopPropagation()}>
                        <h3>Auction:</h3>
                        <input type='file' className="file" id="file" name="file[]" accept=".png, .jpg" onChange={(e) => this.handleOnChangeFile(e)} />
                        {this.state.currentFilePreview ?
                            <img src={this.state.currentFilePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '500px' }} />
                            : null
                        }
                        <input type='number' value={this.state.currentStartPrice} onChange={(e) => { this.setState({ currentStartPrice: Number(e.target.value) }) }} placeholder='Start Price(VND)' />
                        <button onClick={() => this.handleAddAuction(this.state.currentFile, this.state.currentStartPrice)}>
                            Add
                        </button>
                        <div className='auction-list'>
                            {this.state.auction.map((item, index) => {
                                if (item.preview) {
                                    return (
                                        <div key={index}>
                                            <img src={(item.preview)} style={{ maxWidth: '200px', maxHeight: '500px' }} alt="Auction Item" />
                                            <p>Start Price: {item.startPrice} VND</p>
                                            <button onClick={() => this.handleDeleteAuction(index)}>Remove</button>
                                        </div>
                                    )
                                }

                            })}

                        </div>
                        <button onClick={() => this.handleSubmit()}>Submit</button>
                    </div>
                </div>
        )
    }
}
export default AddAuctionComponent;