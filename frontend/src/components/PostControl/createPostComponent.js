import React from "react";
import '../../styles/createPost.scss';

import { toast } from 'react-toastify';
class CreatePostComponent extends React.Component {
    state = {
        title: '',
        content: '',
        file: null,
        filePreview: null,
        visibility: 'PUBLIC',
        isImage: false,

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
    handleFileChange = (e) => {
        const acceptedTypes = ['image/png', 'image/jpeg'];
        if (acceptedTypes.includes(e.target.files[0].type)) {
            this.setState({ file: e.target.files[0], filePreview: URL.createObjectURL(e.target.files[0]), isImage: true, });
        }
        else {
            toast.error("Chỉ hỗ trợ định dạng PNG và JPG", {
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
            this.setState({ file: null, filePreview: null, isImage: false });
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
            const res = await fetch('http://localhost:9999/backend/api/create-post', {
                method: "POST",
                body: formData
            });
            console.log('Response:', res);
            // const result = await res.json();
            if (res.ok) {
                this.setState({
                    title: '',
                    content: '',
                    file: null,
                    filePreview: null,
                    visibility: 'PUBLIC',
                    isImage: false,
                });
                toast.success("Đăng bài thành công!");
            } else {
                toast.error("Đăng bài không thành công, vui lòng thử lại sau.");
            }
        }
        catch (er) {
            this.setState({ message: "Không kết nối được đến server." });
        }
    }
    render() {
        return (
            <div className="create-post-container">
                <div className="post-header">
                    Create Post
                </div>

                <div className="post-form">
                    <input type="text" className="title" placeholder="Post Title" onChange={(event) => this.handleOnChangeTitle(event)} />
                    {
                        !(this.state.isImage) ?
                            null
                            :
                            <img src={this.state.filePreview} alt="image" />
                    }
                    <input type="file" className="file" accept=".png, .jpg" onChange={(event) => this.handleFileChange(event)} />
                    <textarea className="content" placeholder="Write your post content here..." onChange={(event) => this.handleOnChangeContent(event)}></textarea>
                    <select className="visibility" onChange={(event) => this.handleOnChangeVisible(event)}>
                        <option value="PUBLIC">Public</option>
                        <option value="PRIVATE">Private</option>
                    </select>
                    <button onClick={this.handleSubmit}>Post</button>
                </div>


            </div>
        )
    }
}
export default CreatePostComponent;