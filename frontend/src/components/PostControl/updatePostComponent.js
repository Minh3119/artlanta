import React from "react";
import '../../styles/post.scss';
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
            }
            )
        } else {
            this.setState({
                idListAdd: newFileAdd,
                file: newFile,
                filePreview: newPreview,
            }
            )
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
            <div className="create-post-container"
                onClick={this.handleCloseTab}>
                {this.state.isPosting ?
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
                        Edit Post
                    </div>

                    <div className="post-form">
                        <div className="image-list">
                            {
                                this.state.filePreview.map((item, index) => {
                                    return (
                                        <div className="image-container" key={index}>
                                            <div className="image-wrapper">
                                                <img src={item.mediaURL} alt="post-image" />
                                                <button onClick={() => { this.handleRemoveImage(item.ID, index) }}>Remove</button>
                                            </div>
                                        </div>
                                    )
                                })


                            }
                        </div>
                        <label for="file" className="file-label">File</label>
                        <input type="file" className="file" id="file" name="file[]" hidden multiple accept=".png, .jpg" onChange={(event) => this.handleFileChange(event)} />
                        <div className="content-container">
                            <textarea required className="content" value={this.state.content} placeholder="Write your post content here..." onChange={(event) => this.handleOnChangeContent(event)}></textarea>
                            <p>{String(this.state.content.length).padStart(3, '0')}/750</p>
                        </div>
                        <select className="visibility" value={this.state.visibility} onChange={(event) => this.handleOnChangeVisible(event)}>
                            <option value="PUBLIC">Public</option>
                            <option value="PRIVATE">Private</option>
                        </select>

                    </div>
                    <div className="post-button">
                        <button onClick={this.handleSubmit} style={{ backgroundColor: "lightgreen" }}>Save</button>
                        <button style={{ backgroundColor: "lightcoral" }} onClick={this.handleCancel}>Cancel</button>
                    </div>



                </div>
            </div >
        )
    }
}
export default UpdatePostComponent;