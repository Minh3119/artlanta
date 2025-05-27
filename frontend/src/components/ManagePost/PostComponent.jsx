import React from "react";
import { toast } from "react-toastify";
import "../../styles/PostComponent.scss";

class PostComponent extends React.Component {
    state = {
        posts: [
            { id: 1, title: "Hello World", content: "This is my first post!" },
        ],
        newTitle: "",
        newContent: "",
        editIndex: null, // dùng để biết đang sửa post nào
    };

    handleAddPost = () => {
        const { newTitle, newContent, posts } = this.state;
        if (!newTitle || !newContent) {
            toast.error("Please fill in both fields!");
            return;
        }
        const newPost = {
            id: Date.now(),
            title: newTitle,
            content: newContent,
        };
        this.setState({
            posts: [...posts, newPost],
            newTitle: "",
            newContent: "",
        });
    };

    handleEditPost = (index) => {
        const post = this.state.posts[index];
        this.setState({
            newTitle: post.title,
            newContent: post.content,
            editIndex: index,
        });
    };

    handleSaveEdit = () => {
        const { posts, newTitle, newContent, editIndex } = this.state;
        const updatedPosts = [...posts];
        updatedPosts[editIndex] = {
            ...updatedPosts[editIndex],
            title: newTitle,
            content: newContent,
        };
        this.setState({
            posts: updatedPosts,
            newTitle: "",
            newContent: "",
            editIndex: null,
        });
        toast.success("Post updated!");
    };

    handleDeletePost = (index) => {
        const updated = [...this.state.posts];
        updated.splice(index, 1);
        this.setState({ posts: updated });
    };

    render() {
        const { posts, newTitle, newContent, editIndex } = this.state;

        return (
            <div className="post-container">
                <h2 className="post-title">Post Manager</h2>
                <div className="post-form">
                    <input
                        className="post-input"
                        type="text"
                        placeholder="Post title"
                        value={newTitle}
                        onChange={(e) => this.setState({ newTitle: e.target.value })}
                    />
                    <textarea
                        className="post-textarea"
                        placeholder="Post content"
                        value={newContent}
                        onChange={(e) => this.setState({ newContent: e.target.value })}
                    ></textarea>
                    {editIndex !== null ? (
                        <button className="post-btn post-btn-save" onClick={this.handleSaveEdit}>Save Changes</button>
                    ) : (
                        <button className="post-btn post-btn-add" onClick={this.handleAddPost}>Add Post</button>
                    )}
                </div>
                <ul className="post-list">
                    {posts.map((post, index) => (
                        <li className="post-card" key={post.id}>
                            <div className="post-card-content">
                                <h3 className="post-card-title">{post.title}</h3>
                                <p className="post-card-body">{post.content}</p>
                            </div>
                            <div className="post-card-actions">
                                <button className="post-btn post-btn-edit" onClick={() => this.handleEditPost(index)}>Edit</button>
                                <button className="post-btn post-btn-delete" onClick={() => this.handleDeletePost(index)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default PostComponent;
