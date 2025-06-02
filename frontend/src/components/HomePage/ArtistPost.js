import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import OptionsDropdown from './OptionsDropdown';
import userLogo from "../../assets/images/userLogo.svg";
import postImg from "../../assets/images/post-img.svg";
import comment from "../../assets/images/Comment.svg";
import like from "../../assets/images/like.svg";
import unlike from "../../assets/images/unlike.svg";
import save from "../../assets/images/save.svg";
import share from "../../assets/images/share.svg";
import ques from "../../assets/images/question.svg";
import dotsIcon from "../../assets/images/dots.svg";

export default function ArtistPost({ refetch, currentID, openDeletePopup, openUpdatePopup }) {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        fetch("http://localhost:9999/backend/api/post/view", {
            credentials: "include"
        })
            .then((res) => res.json())
            .then((data) => setPosts(data.response))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchPosts(); // gọi khi trang load
    }, [refetch]);

    const handleLike = (postId) => {
        fetch(`http://localhost:9999/backend/api/like?postId=${postId}`, {
            method: "GET",
            credentials: "include"
        })
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Lỗi server: ${res.status} - ${text}`);
                }
                return res.json();
            })
            .then((data) => {
                if (data.status === "success") {
                    setPosts(prevPosts =>
                        prevPosts.map(post =>
                            post.postID === postId
                                ? {
                                    ...post,
                                    isLiked: data.newState,
                                    likeCount: data.newState ? post.likeCount + 1 : post.likeCount - 1
                                }
                                : post
                        )
                    );
                } else {
                    console.error("Toggle like thất bại:", data.message);
                }
            })
            .catch((err) => console.error("Lỗi khi gọi API like:", err));
    };

    const breakpointColumnsObj = {
        default: 3,
        1100: 1,
        700: 1,
    };

    return (
        <div className="row">
            <div className="offset-2 col-8 homepage-post__container--masonry">
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {posts.map((post, index) => (
                        <div className="artistpost-container" key={post.postID}>
                            <div className="artistpost-info">
                                <img
                                    src={post.authorAvatar}
                                    alt=""
                                    className="avatar-img"
                                />
                                <div className="artistpost-user">
                                    <a href={`/user/${post.authorID}`} className="artistpost-user__fullname">
                                        {post.authorFN}
                                    </a>
                                    <a href={`/user/${post.authorID}`} className="artistpost-user__username">
                                        {post.authorUN}
                                    </a>
                                </div>
                                <div className="dots-btn">
                                    <OptionsDropdown
                                        openUpdatePopup={openUpdatePopup}
                                        openDeletePopup={openDeletePopup}
                                        post={post}
                                        currentID={currentID}
                                    />
                                </div>
                            </div>
                            <a href={`/post/${post.postID}`} className="postdetail-link">
                                <p className="artistpost-content">{post.content}</p>
                            </a>
                            <div className="artistpost-morecontent">
                            <a href={`/post/${post.postID}`} className="postdetail-link">
                                <img
                                    src={post.mediaURL[0]}
                                    alt="post-img"
                                    className="post-img"
                                    style={{ height: "auto" }}
                                />
                                </a>
                                <div className="artistpost-react">
                                    <div className="artistpost-react__count">
                                        <div className="artistpost-react__comment">
                                        <a href={`/post/${post.postID}`} className="postdetail-link">
                                            <img src={comment} alt="comment" />
                                            </a>
                                            <p className="comment-count">{post.commentCount}</p>
                                        </div>
                                        <div
                                            className="artistpost-react__like"
                                            onClick={() => handleLike(post.postID)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <a href={post.isLogged ? "#" : "/login"}>
                                                <img src={post.isLiked ? like : unlike} alt="like" />
                                            </a>
                                            <p className="like-count">{post.likeCount} </p>
                                        </div>
                                    </div>
                                    <div className="artistpost-react__uncount">
                                        <a href="#!"><img src={share} alt="share" /></a>
                                        <a href="#!"><img src={save} alt="save" /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Masonry>
            </div>
            <div className="col-2 homepage-question__container">
                <div className="homepage-question">
                    <a href="#!">
                        <img src={ques} alt="quesAi" />
                    </a>
                </div>
            </div>
        </div>
    );
}
