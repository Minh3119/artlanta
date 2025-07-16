import React from 'react';
import { toast } from 'react-toastify';
import { Navigate } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import '../../styles/liveForm.scss';
class LiveFormComponent extends React.Component {
    state = {
        channelLink: '',
        title: '',
        currentFile: null,
        currentFilePreview: null,
        currentStartPrice: 0,
        auction: [
            //image
            //preview
            //startPrice
        ],
        visibility: "PUBLIC",
        isSubmit: null,
        ID: 0,
    }
    extractYouTubeUsername = (url) => {
        const regex = /^https?:\/\/(www\.)?youtube\.com\/(@[A-Za-z0-9_.-]+)\/?$/;
        const match = url.match(regex);
        return match ? match[2] : null;
    }
    handleSubmit = async () => {
        const { channelLink, title, visibility, auction } = this.state;

        if (this.extractYouTubeUsername(channelLink) === null) {
            return toast.error("Invalid YouTube channel link. Please provide a valid link in the format: https://www.youtube.com/@username");
        }

        const formData = new FormData();
        formData.append("channelLink", this.extractYouTubeUsername(channelLink));
        formData.append("title", title);
        formData.append("visibility", visibility);

        auction.forEach((item, index) => {
            formData.append(`image_${index}`, item.image);
            formData.append(`startPrice_${index}`, item.startPrice);
        });
        formData.append("total", auction.length);
        console.log("Form data prepared:", auction.length.toString());

        try {
            const res = await fetch("http://localhost:9999/backend/api/live/check", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            const data = await res.json();

            if (res.ok && data.response) {
                this.setState({
                    channelLink: '',
                    title: '',
                    visibility: "PUBLIC",
                    isSubmit: `/live/detail/${data.response}`,
                    auction: [],
                });
                toast.success("Channel success");
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.log("Server error!", error);
            this.setState({ message: "Cannot connect to the server." });
        }
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
    handleOnChangeFile = async (e) => {
        const acceptedTypes = ['image/png', 'image/jpeg'];
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
    render() {
        if (this.state.isSubmit) {
            return (<Navigate to={this.state.isSubmit} />)
        }
        return (
            <div className='live-form-wrapper'>
                <div className='live-form-container'>
                    <div className='live-form-header'>
                        <h2>Live form</h2>
                        <button>X</button>
                    </div>
                    <input type='text' placeholder='Link' value={this.state.channelLink}
                        onChange={(e) => { this.setState({ channelLink: e.target.value }) }} />
                    <input type='text' placeholder='title' value={this.state.title}
                        onChange={(e) => { this.setState({ title: e.target.value }) }} />
                    <div className='auction-container'>
                        <h3>Auction:</h3>
                        <input type='file' className="file" id="file" name="file[]" onChange={(e) => this.handleOnChangeFile(e)} />
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
                    </div>
                    <select value={this.state.visibility} onChange={(e) => { this.setState({ visibility: e.target.value }) }}>
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                    <button onClick={() => this.handleSubmit()}>Submit</button>
                </div>
            </div>
        )
    }

}
export default LiveFormComponent;