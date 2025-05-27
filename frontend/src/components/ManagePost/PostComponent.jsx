import React from "react";
import { toast } from "react-toastify";
import "../../styles/PostComponent.scss";

class PostComponent extends React.Component {
    state = {
        posts: [],
        newTitle: "",
        newContent: "",
        editIndex: null,
        editPostId: null,
    };

    componentDidMount() {
        this.fetchPosts();
    }

    fetchPosts = async () => {
        try {
            const res = await fetch("/api/posts"); // Adjust endpoint as needed
            const data = await res.json();
            if (data.success) {
                this.setState({ posts: data.posts });
            } else {
                toast.error(data.message || "Failed to fetch posts");
            }
        } catch (err) {
            toast.error("Error fetching posts");
        }
    };

    handleAddPost = async () => {
        const { newTitle, newContent } = this.state;
        if (!newTitle || !newContent) {
            toast.error("Please fill in both fields!");
            return;
        }
        try {
            const res = await fetch("/createPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTitle,
                    content: newContent,
                    mediaUrl: "",
                    isDraft: false,
                    visibility: "public",
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Post added!");
                this.setState({ newTitle: "", newContent: "" });
                this.fetchPosts();
            } else {
                toast.error(data.message || "Failed to add post");
            }
        } catch (err) {
            toast.error("Error adding post");
        }
    };

    handleEditPost = (index) => {
        const post = this.state.posts[index];
        this.setState({
            newTitle: post.title,
            newContent: post.content,
            editIndex: index,
            editPostId: post.id,
        });
    };

    handleSaveEdit = async () => {
        const { newTitle, newContent, editPostId } = this.state;
        try {
            const res = await fetch("/editPost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    postId: editPostId,
                    title: newTitle,
                    content: newContent,
                    mediaUrl: "",
                    isDraft: false,
                    visibility: "public",
                }),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Post updated!");
                this.setState({
                    newTitle: "",
                    newContent: "",
                    editIndex: null,
                    editPostId: null,
                });
                this.fetchPosts();
            } else {
                toast.error(data.message || "Failed to update post");
            }
        } catch (err) {
            toast.error("Error updating post");
        }
    };

    handleDeletePost = async (index) => {
        const post = this.state.posts[index];
        try {
            const res = await fetch("/deletePost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post.id }),
                credentials: "include",
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Post deleted!");
                this.fetchPosts();
            } else {
                toast.error(data.message || "Failed to delete post");
            }
        } catch (err) {
            toast.error("Error deleting post");
        }
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