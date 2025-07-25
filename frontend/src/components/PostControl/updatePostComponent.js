import React from "react";
import logo from '../../assets/images/arlanta.svg';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';

class UpdatePostComponent extends React.Component {
    state = {
        postID: 0,
        content: '',
        idListDelete: [0],
        idListAdd: [],
        file: [],
        filePreview: [],
        visibility: 'PUBLIC',
        isLoading: false,
        isPosting: false,
    }

    handleCloseTab = () => {
        //logic lay thay doi props isUpdateOpen
        console.log("out create");
        this.props.closeUpdatePopup();
    }

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
                    toastId: "update-fullname-toast",
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
            toastId: "update-cancel",
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
            title: '',
            content: '',
            file: [],
            filePreview: [],
            visibility: 'PUBLIC',
            // isImage: false,
            isLoading: false,
            isPosting: false,
        })
        this.props.closeUpdatePopup();
    }

    handleRemoveImage = (ID, index) => {
        const newFile = [...this.state.file];
        const newFileAdd = [...this.state.idListAdd];
        const newPreview = [...this.state.filePreview];

        newFile.splice(index, 1);
        newFileAdd.splice(index, 1);
        newPreview.splice(index, 1);

        if (ID !== 0) {
            this.setState({
                idListDelete: [...this.state.idListDelete, ID],
                file: newFile,
                filePreview: newPreview,
            })
        } else {
            this.setState({
                idListAdd: newFileAdd,
                file: newFile,
                filePreview: newPreview,
            })
        }
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

        document.getElementsByClassName("file")[0].value = "";

        for (const file of files) {
            if (!acceptedTypes.includes(file.type)) {
                toast.error(`File "${file.name}" wrong format (only PNG or JPG)`, {
                    toastId: "update-file-type-toast",
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
                    preview: {
                        mediaURL: URL.createObjectURL(compressedFile),
                        ID: 0
                    },
                });
            } catch (err) {
                console.error("Compress error:", file.name, err);
            }
        }

        if (validFiles.length > 0) {
            if (this.state.file != null) {
                this.setState({
                    file: [...this.state.file, ...validFiles.map(f => f.file)],
                    idListAdd: [...this.state.idListAdd, ...validFiles.map(f => f.file)],
                    filePreview: [...this.state.filePreview, ...validFiles.map(f => f.preview)],
                    isImage: true,
                });
            }
            else {
                this.setState({
                    file: validFiles.map(f => f.file),
                    idListAdd: validFiles.map(f => f.file),
                    filePreview: validFiles.map(f => f.preview),
                    isImage: true,
                });
            }
        } else {
            this.setState({
                files: [],
                filePreviews: [],
                // isImage: false,
            });
        }
    };

    handleOnChangeVisible = (e) => {
        this.setState({ visibility: e.target.value });
    }

    //componentDidMount call when the component loading first time
    //  fetchin api from server -> data
    //      Get the old URL -> fetching each URL -> URL file -> .blob() tranform into Blob -> file property data -> new File([blob], filename, option)
    //  setState data
    componentDidMount = () => {
        fetch(`http://localhost:9999/backend/api/post/update?postID=${this.props.updatePostID}`, {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch post data');
                return response.json();
            })
            .then(async data => {
                const previewUrls = Array.isArray(data.response.imageUrl) ? data.response.imageUrl : [];

                const filesFromUrls = await Promise.all(
                    previewUrls.map(async (item, index) => {
                        const response = await fetch(item.mediaURL);
                        const blob = await response.blob();
                        return new File([blob], `image_${index}`, { type: blob.type });
                    })
                );
                this.setState({
                    postID: data.response.postID,
                    title: data.response.title || "",
                    content: data.response.content || "",
                    visibility: data.response.visibility || "Public",
                    file: filesFromUrls,
                    filePreview: previewUrls,
                });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }

    handleSubmit = async () => {
        if (!(this.state.content.trim())) {
            toast.error(`Content cannot be blank`, {
                toastId: "update-content-blank",
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
        formData.append("postID", this.props.updatePostID);
        formData.append("title", this.state.title);
        formData.append("content", this.state.content);
        if (this.state.idListAdd) {
            const images = this.state.idListAdd;
            images.forEach((file) => {
                formData.append("file[]", file);
            })
        }
        if (this.state.idListDelete) {
            const del = this.state.idListDelete;
            del.forEach((id) => {
                formData.append("ID", id);
            })
        }
        formData.append("visibility", this.state.visibility);
        try {
            this.setState({ isPosting: true });
            const res = await fetch('http://localhost:9999/backend/api/post/update', {
                method: "POST",
                body: formData,
                credentials: 'include'
            });
            console.log('Response:', res);
            if (res.ok) {
                this.setState({
                    title: '',
                    content: '',
                    file: [],
                    filePreview: [],
                    visibility: 'PUBLIC',
                    isPosting: false,
                });
                toast.success(`Update completed!`, {
                    toastId: "update-complete",
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
                this.props.closeUpdatePopup();
            } else {
                toast.error(`Update error, try again later.`, {
                    toastId: "update-error",
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
            this.setState({ message: "cannot connect to the server" });
            console.log("server error!", er);
        }
    }

    render() {
        return (
          <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50 p-4 " onClick={this.handleCloseTab}>

                
                
                {this.state.isPosting && (
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

                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white">Edit Post</h2>
                    </div>

                    {/* Form Content */}
                    <div className="p-8 space-y-6">
                        
                        {/* Image Preview Section */}
                        {this.state.filePreview.length > 0 && (
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-gray-700">Images</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {this.state.filePreview.map((item, index) => (
                                        <div key={index} className="relative group">
                                            <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
                                                <img 
                                                    src={item.mediaURL} 
                                                    alt="post-image" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <button 
                                                    onClick={() => { this.handleRemoveImage(item.ID, index) }}
                                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors opacity-0 group-hover:opacity-100"
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
                        <div className="space-y-3">
                            <label 
                                htmlFor="file" 
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-xl cursor-pointer transition-all transform hover:scale-105 shadow-lg"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                Add Images
                            </label>
                            <input 
                                type="file" 
                                className="file hidden" 
                                id="file" 
                                name="file[]" 
                                multiple 
                                accept=".png, .jpg" 
                                onChange={(event) => this.handleFileChange(event)} 
                            />
                        </div>

                        {/* Content Textarea */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">Content</label>
                            <div className="relative">
                                <textarea 
                                    required 
                                    className="w-full h-40 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none text-gray-700 placeholder-gray-400" 
                                    value={this.state.content} 
                                    placeholder="Write your post content here..." 
                                    onChange={(event) => this.handleOnChangeContent(event)}
                                />
                                <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-white px-2 py-1 rounded-lg border">
                                    {String(this.state.content.length).padStart(3, '0')}/750
                                </div>
                            </div>
                        </div>

                        {/* Visibility Select */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">Visibility</label>
                            <select 
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white text-gray-700" 
                                value={this.state.visibility} 
                                onChange={(event) => this.handleOnChangeVisible(event)}
                            >
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-8 py-6 flex justify-end space-x-4">
                        <button 
                            onClick={this.handleCancel}
                            className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors transform hover:scale-105 shadow-lg"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={this.handleSubmit}
                            className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium rounded-xl transition-all transform hover:scale-105 shadow-lg"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdatePostComponent;