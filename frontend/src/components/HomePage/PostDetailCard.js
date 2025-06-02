
import React, { useState, useEffect } from "react";
import ques from "../../assets/images/question.svg";
import likeComment from "../../assets/images/like-comment.svg";
import replyComment from "../../assets/images/reply-comment.svg";
import PostImageSlider from "./PostImageSlider";

export default function PostDetailCard({ postId }) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImgIndex, setCurrentImgIndex] = useState(0);
    const [commentContent, setCommentContent] = useState("");

    const handleNextImage = () => {
        if (post.mediaURL && currentImgIndex < post.mediaURL.length - 1) {
            setCurrentImgIndex(currentImgIndex + 1);
        }
    };

    const handlePrevImage = () => {
        if (currentImgIndex > 0) {
            setCurrentImgIndex(currentImgIndex - 1);
        }
    };

    const fetchPostData = async () => {
        if (!postId) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:9999/backend/api/post/view/${postId}`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error(`Lỗi khi lấy bài viết: ${res.status}`);
            const data = await res.json();
            setPost(data.response);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostData();
    }, [postId]);

    const handleCommentSubmit = async () => {
        if (!commentContent.trim()) {
            alert("Bình luận không được để trống");
            return;
        }

        try {
            // Mã hóa content để tránh lỗi query parameter
            const encodedContent = encodeURIComponent(commentContent);
            console.log("Sending GET request to /api/comment/add", {
                postID: postId,
                content: commentContent,
            });
            const response = await fetch(
                `http://localhost:9999/backend/api/comment/add?postID=${postId}&content=${encodedContent}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const responseText = await response.text();
            console.log("Response status:", response.status, "Response text:", responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                throw new Error(`Phản hồi không phải JSON: ${responseText.substring(0, 100)}... (Status: ${response.status})`);
            }

            if (response.ok && data.success) {
                setCommentContent("");
                fetchPostData();
                alert("Đã thêm bình luận thành công");
            } else {
                alert(data.error || "Lỗi khi thêm bình luận");
            }
        } catch (error) {
            alert("Lỗi: " + error.message);
            console.error("Chi tiết lỗi:", error);
        }
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;
    if (!post) return <p>Không tìm thấy bài viết</p>;

    return (
        <div className="row">
            <div className="offset-1 col-10 postcard-container">
                <div className="postcard-img__container">
                    <PostImageSlider mediaURL={post.mediaURL} className="postcard-img" />
                </div>
                <div className="postComment-container">
                    <div className="comment-user">
                        <div className="userComment-logo__container">
                            <img
                                src={post.authorAvatar}
                                alt="your avatar"
                                className="userComment-logo"
                            />
                        </div>
                        <div className="comment-form">
                            <input
                                type="text"
                                className="comment-input"
                                placeholder="Add a comment"
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                            />
                            <button type="button" onClick={handleCommentSubmit}>
                                Post
                            </button>
                        </div>
                    </div>
                    <div className="comment-container">
                        <div className="comment-part">
                            <div className="comment-part__container parent">
                                <img
                                    src={post.authorAvatar}
                                    alt="your avatar"
                                    className=""
                                />
                                <div className="comment-content__container">
                                    <div className="comment-meta">
                                        <p className="comment-user">{post.authorFN} - Author</p>
                                        <p className="comment-date">{post.createdAt}</p>
                                    </div>
                                    <div className="comment-content__out">
                                        <p className="comment-content">{post.content}</p>
                                    </div>
                                </div>
                            </div>
                            {post.commentsList &&
                                post.commentsList.map((c, index) => (
                                    <div key={index} className="comment-part__container child">
                                        <img
                                            src={c.cmtUserAvatarURL}
                                            alt=""
                                            className="userComment-logo"
                                        />
                                        <div className="comment-content__container">
                                            <div className="comment-meta">
                                                <p className="comment-user">{c.cmtUserFullName}</p>
                                                <p className="comment-date">
                                                    {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                                                </p>
                                            </div>
                                            <div className="comment-content__out">
                                                <p className="comment-content">{c.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-1 homepage-question__container">
                <div className="homepage-question">
                    <a href="#!">
                        <img src={ques} alt="quesAi" />
                    </a>
                </div>
            </div>
        </div>
    );
}
