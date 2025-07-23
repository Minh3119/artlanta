import React from "react";
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
                toastId: "delete-result-toast",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                className: "toast-complete"
            })
        }
    }

    handleCancel = () => {
        toast.error("The process has been canceled!", {
            toastId: "delete-cancel",
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            className: "toast-complete"
        });
        this.setState({
            title: '',
            content: '',
            file: [],
            filePreview: [],
            visibility: 'PUBLIC',
            // isImage: false,
            isLoading: false,
            isPosting: false,
        })
        this.props.closeDeletePopup();
    }

    handleSubmit = async () => {
        if ((this.state.result) === (this.state.script)) {
            const formData = new FormData();
            formData.append("postID", this.props.deletePostID); //get from post detail
            try {
                this.setState({ isDelete: true });
                const res = await fetch('http://localhost:9999/backend/api/post/delete', {
                    method: "POST",
                    body: formData,
                    credentials: 'include'
                });
                if (res.ok) {
                    this.setState({
                        result: "",
                        isDelete: false,
                    });
                    toast.success('Delete completed!', {
                        toastId: "delete-complete",
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        className: "toast-complete"
                    })
                    this.props.closeDeletePopup();
                } else {
                    toast.error('Delete error, try again later', {
                        toastId: "delete-error",
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        className: "toast-complete"
                    })
                }
            }
            catch (er) {
                console.log("server error!", er);
            }
        }
        else {
            toast.error('The result is not equal to the script!', {
                toastId: "delete-error-notequal",
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
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

    handleGenRandom = (length = 5) => {
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
        console.log(this.props.deletePostID);
    }

    render() {
        return (
            <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50 p-4"

                onClick={this.handleCloseTab}>
                
                {this.state.isDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                        <div className="bg-white rounded-xl p-8 flex flex-col items-center space-y-4 shadow-2xl">
                            <span className="text-lg font-medium text-gray-700">Loading...</span>
                            <img
                                src={logo}
                                alt="Loading..."
                                className="w-12 h-12 animate-spin"
                            />
                        </div>
                    </div>
                )}

                <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 px-8 py-6">
                        <h2 className="text-xl font-bold text-white text-center">Delete Confirmation</h2>
                    </div>

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        
                        {/* Warning Message */}
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                </svg>
                            </div>
                            <p className="text-lg font-semibold text-gray-800">
                                Are you sure you want to delete this post?
                            </p>
                            <p className="text-sm text-gray-600">
                                This action cannot be undone. Please type the captcha code below to confirm.
                            </p>
                        </div>

                        {/* Verification Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Type exactly like this script:
                                </label>
                                <div className="bg-gray-100 border-2 border-gray-300 rounded-xl p-4">
                                    <div className="font-mono text-lg font-bold text-center text-gray-800 tracking-wider bg-white rounded-lg py-3 border-2 border-dashed border-gray-400">
                                        {this.state.script}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Confirmation input:
                                </label>
                                <input 
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-mono text-lg text-center tracking-wider" 
                                    autoFocus 
                                    type="text" 
                                    placeholder="Input the script" 
                                    value={this.state.result}
                                    onChange={(e) => this.handleOnChangeResult(e)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            this.handleSubmit();
                                        }
                                    }}
                                />
                            </div>

                            {/* Match Indicator */}
                            {this.state.result && (
                                <div className="text-center">
                                    {this.state.result === this.state.script ? (
                                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            Captcha matches!
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                            Captcha doesn't match
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-8 py-6 flex justify-end space-x-4">
                        <button 
                            onClick={this.handleCancel}
                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors transform hover:scale-105 shadow-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => this.handleSubmit()}
                            disabled={this.state.result !== this.state.script}
                            className={`px-6 py-3 font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                                this.state.result === this.state.script
                                    ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Delete Post
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default DeletePostComponent;