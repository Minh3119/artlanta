import React from "react";
import '../../styles/post.scss';
import logo from '../../assets/images/arlanta.svg';
import { toast } from 'react-toastify';
class DeletePostComponent extends React.Component {
    state = {
        script: "ABCDEFGMLNOMNSN",
        result: "",
        postID: 0,
    }
    handleCloseTab = () => {
        //logic lay thay doi props isDeleteOpen
        console.log("out create");
        this.props.closeDeletePopup();
    }
    handleOnChangeResult = (e) => {
        const newRs = e.target.value;
        if (newRs.length <= 15) {
            this.setState({
                result: newRs,
            })
        }
        else {
            toast.error('No more words!', {
                toastId: "result-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                className: "toast-complete"
            })
        }
    }
    handleSubmit = async () => {
        if ((this.state.result) === (this.state.script)) {
            const formData = new FormData();
            formData.append("postID", this.props.postID); //get from post detail
            try {
                this.setState({ isDelete: true });
                const res = await fetch('http://localhost:9999/backend/api/post/delete', {
                    method: "POST",
                    body: formData
                });
                console.log('Response:', res);
                if (res.ok) {
                    this.setState({
                        result: "",
                        isDelete: false,
                    });
                    toast.success("Delete completed!");
                    this.props.closeDeletePopup();
                } else {
                    toast.error("Delete error, try again later");
                }
            }
            catch (er) {
                console.log("server error!", er);
            }
        }
        else {
            toast.error('The result is not equal to the script!', {
                toastId: "error-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                className: "toast-complete"
            })
        }




    }
    generateAndSaveScript = () => {
        const script = this.handleGenRandom();
        this.setState({ script: script });
    };
    handleGenRandom = (length = 15) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }
    componentDidMount = () => {
        this.generateAndSaveScript();
    }
    render() {
        return (
            <div className="delete-post-container" onClick={this.handleCloseTab}>
                {this.state.isDelete ?
                    <div className="loading-container">
                        <span>Loading ...</span>
                        <img
                            src={logo}
                            alt="Loading..."
                            className="loading-spinner"
                        /></div>
                    : null}
                <div className="post-popup"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="post-header">
                        Are you sure want to delete this post?
                    </div>
                    <div className="post-form">
                        <p>Text exactly like this script:</p>
                        <div className="post-input">
                            <textarea className="confirm-script" disabled type="text" readOnly placeholder={this.state.script}>

                            </textarea>
                            <input className="confirm-result" type="text" placeholder="Input the script" value={this.state.result} onChange={(e) => this.handleOnChangeResult(e)} />
                            <div className="post-button">
                                <button onClick={this.handleSubmit} style={{ backgroundColor: "lightgreen" }}>Confirm</button>
                                <button style={{ backgroundColor: "lightcoral" }} onClick={this.handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default DeletePostComponent;