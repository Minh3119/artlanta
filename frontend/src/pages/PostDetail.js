import Header from "../components/HomePage/Header";
import PostDetailCard from "../components/HomePage/PostDetailCard";
import "../styles/postDetail.css";

export default function PostDetail() {
  return (
    <div className="postDetails-container">
      <Header></Header>
      <div className="homepage-time">March 22, 2023</div>
      <div className="homepage-title">Artwork Posts</div>

      <PostDetailCard></PostDetailCard>
    </div>
  );
}
