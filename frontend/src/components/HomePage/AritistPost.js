import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import OptionsDropdown from './OptionsDropdown';
import userLogo from "../../assets/images/userLogo.svg";
import postImg from "../../assets/images/post-img.svg";
import comment from "../../assets/images/Comment.svg";
import like from "../../assets/images/like.svg";
import save from "../../assets/images/save.svg";
import share from "../../assets/images/share.svg";
import ques from "../../assets/images/question.svg";
import dotsIcon from "../../assets/images/dots.svg";


export default function ArtistPost({ refetch, openDeletePopup, openUpdatePopup }) {
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        fetch("http://localhost:9999/backend/api/post/view")
            .then((res) => res.json())
            .then((data) => setPosts(data.response))
            .catch((err) => console.error(err));
    }, [refetch]);
    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
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
                        <div className="artistpost-container" key={post.id || index}>
                            <div className="artistpost-info">
                                <img
                                    src={post.authorAvatar}
                                    alt=""
                                    className="avatar-img"
                                />
                                <div className="artistpost-user">
                                    <a href="#!" className="artistpost-user__username">
                                        {post.authorFN}
                                    </a>
                                    <a href="#!" className="artistpost-user__email">
                                        {post.authorUN}
                                    </a>
                                </div>
                                <div className="dots-btn">
                                    <OptionsDropdown
                                        openUpdatePopup={openUpdatePopup}
                                        openDeletePopup={openDeletePopup}
                                    />
                                </div>

                            </div>


                            <p className="artistpost-content">{post.content}</p>
                            <div className="artistpost-morecontent">
                                <img
                                    src={
                                        post.mediaURL && post.mediaURL.length > 0
                                            ? post.mediaURL[0]
                                            : postImg
                                    }
                                    alt="post-img"
                                    className="post-img"
                                    style={{ height: "auto" }}
                                />
                                <div className="artistpost-react">
                                    <div className="artistpost-react__count">
                                        <div className="artistpost-react__comment">
                                            <img src={comment} alt="comment" />
                                            <p className="comment-count">{post.commentCount}</p>
                                        </div>
                                        <div className="artistpost-react__like">
                                            <img src={like} alt="like" />
                                            <p className="like-count">{post.likeCount}</p>
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
