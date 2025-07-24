import React from "react";

import '../../styles/post.scss';
import logo from '../../assets/images/arlanta.svg';

import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
class CreatePostComponent extends React.Component {
    state = {
        // title: '',
        content: '',
        file: [],
        filePreview: [],
        visibility: 'PUBLIC',
        // isImage: false,
        isLoading: false,
        isPosting: false,

    }
    handleCloseTab = () => {
        //logic lay thay doi props isCreateOpen
        console.log("out create");
        this.props.closeCreatePopup();

    }
    // handleOnChangeTitle = (e) => {
    //     this.state.title.length <= 100 ?
    //         (
    //             this.setState({
    //                 title: e.target.value
    //             })
    //         )
    //         :
    //         (
    //             toast.error('title too long!', {
    //                 toastId: "fullname-toast",
    //                 position: "top-right",
    //                 autoClose: 3000,
    //                 hideProgressBar: false,
    //                 closeOnClick: false,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "light",
    //                 className: "toast-complete"
    //             })
    //         )
    // };
    handleOnChangeContent = (e) => {
        const newContent = e.target.value;
        newContent.length <= 750 ?
            (
                this.setState({
                    content: newContent
                })
            )
            :
            (
                toast.error('Content too long!', {
                    toastId: "fullname-toast",
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
            )
    };
    handleCancel = () => {
        toast.error("The process has been canceled!", {
            toastId: "cancel",
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
        this.setState({
            // title: '',
            content: '',
            file: [],
            filePreview: [],
            visibility: 'PUBLIC',
            // isImage: false,
            isLoading: false,
            isPosting: false,
        })
        this.props.closeCreatePopup();
    }
    handleRemoveImage = (index) => {
        const newFile = [...this.state.file];
        const newPreview = [...this.state.filePreview];

        newFile.splice(index, 1);
        newPreview.splice(index, 1);


        this.setState({
            file: newFile,
            filePreview: newPreview,
        }
        )
    };

    //handleFileChange
    //check format file PNG or JPG
    //Degrade the file size -> increase upload into third-party image storage
    //input multiple file (wrong format will be remove)
    handleFileChange = async (e) => {
        const acceptedTypes = ['image/png', 'image/jpeg'];
        const options = {
            maxSizeMB: 0.4,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };

        const files = Array.from(e.target.files);
        const validFiles = [];

        // Reset input
        e.target.value = "";

        for (const file of files) {
            if (!acceptedTypes.includes(file.type)) {
                toast.error(`File "${file.name}" wrong format (only PNG or JPG)`, {
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
                continue;
            }

            try {
                const compressedFile = await imageCompression(file, options);
                validFiles.push({
                    file: compressedFile,
                    preview: URL.createObjectURL(compressedFile),
                });
            } catch (err) {
                console.error("Compress error:", file.name, err);
            }
        }

        if (validFiles.length > 0) {
            if (this.state.file != null) {
                this.setState({
                    file: [...this.state.file, ...validFiles.map(f => f.file)],
                    filePreview: [...this.state.filePreview, ...validFiles.map(f => f.preview)],
                });
            } else {
                this.setState({
                    file: validFiles.map(f => f.file),
                    filePreview: validFiles.map(f => f.preview),
                });
            }
        } else {
            this.setState({
                file: [],
                filePreview: [],
            });
        }
    };
    handleOnChangeVisible = (e) => {
        this.setState({ visibility: e.target.value });
    }
    handleSubmit = async () => {
        if (!(this.state.content.trim())) {
            toast.error(`Content cannot be blank`, {
                toastId: "content-blank",
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
            return;
        }
        const formData = new FormData();
        // formData.append("title", this.state.title);
        formData.append("content", this.state.content);
        if (this.state.file) {
            const images = this.state.file;
            images.forEach((file, index) => {
                formData.append("file[]", file);
            })

        }
        formData.append("visibility", this.state.visibility);
        try {
            this.setState({ isPosting: true });
            const res = await fetch('http://localhost:9999/backend/api/post/create', {
                method: "POST",
                body: formData,
                credentials: 'include'
            });
            console.log("res", res);
            if (res.ok) {
                this.setState({
                    title: '',
                    content: '',
                    file: [],
                    filePreview: [],
                    visibility: 'PUBLIC',
                    // isImage: false,
                    isPosting: false,
                });
                toast.success(`completed`, {
                    toastId: "complete",
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

                this.props.closeCreatePopup();

            } else {
                toast.error(`Create post error, try again later`, {
                    toastId: "error",
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
        }
        catch (er) {
            this.setState({ message: "Cannot connect to the server." });
            console.log("server error!", er);
        }
    }
    render() {
        return (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={this.handleCloseTab}
            >
                {/* Loading Overlay */}
                {this.state.isPosting && (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-60">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="text-lg font-medium text-gray-700">Creating your post...</div>
                            <img
                                src={logo}
                                alt="Loading..."
                                className="w-10 h-10 animate-spin"
                            />
                        </div>
                    </div>
                )}

                {/* Main Modal */}
                <div 
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <h2 className="text-xl font-bold text-white">Create New Post</h2>
                    </div>

                    {/* Form Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        
                        {/* Image Preview Grid */}
                        {this.state.filePreview.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {this.state.filePreview.map((item, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                                <img 
                                                    src={item} 
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button 
                                                    onClick={() => this.handleRemoveImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Upload */}
                        <div className="mb-6">
                            <label 
                                htmlFor="file" 
                                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex flex-col items-center">
                                    <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <p className="text-sm text-gray-500">Click to upload images</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 0.4MB</p>
                                </div>
                                <input 
                                    type="file" 
                                    id="file" 
                                    className="hidden" 
                                    multiple 
                                    accept=".png,.jpg,.jpeg"
                                    onChange={this.handleFileChange} 
                                />
                            </label>
                        </div>

                        {/* Content Textarea */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Post Content
                            </label>
                            <div className="relative">
                                <textarea 
                                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    value={this.state.content} 
                                    placeholder="What's on your mind? Share your thoughts..."
                                    onChange={this.handleOnChangeContent}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                    {String(this.state.content.length).padStart(3, '0')}/750
                                </div>
                            </div>
                        </div>

                        {/* Visibility Select */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Who can see this post?
                            </label>
                            <select 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={this.state.visibility} 
                                onChange={this.handleOnChangeVisible}
                            >
                                <option value="PUBLIC">🌍 Public - Everyone can see</option>
                                <option value="PRIVATE">🔒 Private - Only you can see</option>
                            </select>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t">
                        <button 
                            onClick={this.handleCancel}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={this.handleSubmit}
                            disabled={this.state.isPosting || !this.state.content.trim()}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                        >
                            {this.state.isPosting ? 'Creating...' : 'Create Post'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

}
export default CreatePostComponent;