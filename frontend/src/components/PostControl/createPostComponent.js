import React from "react";

import '../../styles/createPost.scss';

import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
class CreatePostComponent extends React.Component {
    state = {
        title: '',
        content: '',
        file: [],
        filePreview: [],
        visibility: 'PUBLIC',
        // isImage: false,
        isLoading: false,
        isPosting: false,

    }
    handleOnChangeTitle = (e) => {
        this.state.title.length <= 100 ?
            (
                this.setState({
                    title: e.target.value
                })
            )
            :
            (
                toast.error('title too long!', {
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
    handleOnChangeContent = (e) => {
        this.state.content.length <= 1000 ?
            (
                this.setState({
                    content: e.target.value
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
    handleRemoveImage = (index) => {
        const newFile = this.state.file;
        const newPreview = this.state.filePreview;

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
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };

        const files = Array.from(e.target.files);
        const validFiles = [];

        for (const file of files) {
            if (!acceptedTypes.includes(file.type)) {
                toast.error(`File "${file.name}" wrong format (only PNG or JPG)`, {
                    toastId: "file-type-toast-${file.name}",
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
                    isImage: true,
                });
            }
            else {
                this.setState({
                    file: validFiles.map(f => f.file),
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
    handleSubmit = async () => {
        if (!(this.state.title.trim()) || !(this.state.content.trim())) {
            toast.error("Tiêu đề và nội dung không được để trống");
            return;
        }
        const formData = new FormData();
        formData.append("title", this.state.title);
        formData.append("content", this.state.content);
        if (this.state.file) {
            formData.append("file", this.state.file);
        }
        formData.append("visibility", this.state.visibility);

        try {
            this.setState({ isPosting: true });
            const res = await fetch('http://localhost:9999/backend/api/post/create', {
                method: "POST",
                body: formData
            });
            console.log('Response:', res);
            if (res.ok) {
                this.setState({
                    title: '',
                    content: '',
                    file: null,
                    filePreview: null,
                    visibility: 'PUBLIC',
                    // isImage: false,
                    isPosting: false,
                });
                toast.success("Đăng bài thành công!");
            } else {
                toast.error("Đăng bài không thành công, vui lòng thử lại sau.");
            }
        }
        catch (er) {
            this.setState({ message: "Không kết nối được đến server." });
            console.log("server error!", er);
        }
    }
    render() {
        return (
            <div className="create-post-container">
                {this.state.isPosting ?
                    <div>Loading...</div>
                    : null}
                <div className="post-popup">
                    <div className="post-header">
                        Create Post
                    </div>

                    <div className="post-form">
                        <div className="title-container">
                            <input type="text" className="title" value={this.state.title} placeholder="Post Title" onChange={(event) => this.handleOnChangeTitle(event)} />
                            <p>{String(this.state.title.length).padStart(3, '0')}/100</p>
                        </div>
                        {
                            this.state.filePreview.map((item, index) => {
                                return (
                                    <div className="image-container" key={index}>
                                        <div className="image-wrapper">
                                            <img src={item} alt="post-image" />
                                            <button onClick={(index) => { this.handleRemoveImage(index) }}>Remove</button>
                                        </div>
                                    </div>
                                )
                            })



                        }
                        <label for="file" className="file-label">File</label>
                        <input type="file" id="file" hidden multiple accept=".png, .jpg" onChange={(event) => this.handleFileChange(event)} />
                        <div className="content-container">
                            <textarea className="content" value={this.state.content} placeholder="Write your post content here..." onChange={(event) => this.handleOnChangeContent(event)}></textarea>
                            <p>{String(this.state.content.length).padStart(4, '0')}/1000</p>
                        </div>
                        <select className="visibility" onChange={(event) => this.handleOnChangeVisible(event)}>
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                        </select>

                    </div>
                    <div className="post-button">
                        <button onClick={this.handleSubmit} style={{ backgroundColor: "lightgreen" }}>Create</button>
                        <button style={{ backgroundColor: "lightcoral" }}>Cancel</button>
                    </div>



                </div>
            </div >
        )
    }
}
export default CreatePostComponent;