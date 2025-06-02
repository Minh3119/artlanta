import Header from "../components/HomePage/Header";
import PostDetailCard from "../components/HomePage/PostDetailCard";
import "../styles/postDetail.css";
import { useParams } from 'react-router-dom';

export default function PostDetail() {
        const { postID } = useParams();
  return (
    <div className="postDetails-container">
      <Header></Header>
      <div className="homepage-time">Post Detail</div>
      <div className="homepage-title">Artwork Posts</div>
      <div className="container mt-3">
      <PostDetailCard postId={postID} />
    </div>
      <PostDetailCard></PostDetailCard>
    </div>
  );
}
