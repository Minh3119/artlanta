import React from "react";
import "../styles/homepage.css";    

export default function PostDetail() {
  // dữ liệu mẫu
  const post = {
    authorAvatar: "https://i.pravatar.cc/150?img=3",
    authorFN: "Nguyễn Văn A",
    authorUN: "nguyenvana",
    content: "Hôm nay là một ngày tuyệt vời để sáng tạo!",
    image: "https://picsum.photos/seed/postimage/600/400"
  };

  const comments = [
    {
      avatar: "https://i.pravatar.cc/150?img=4",
      name: "Trần Thị B",
      text: "Bài viết rất hay, cảm ơn bạn đã chia sẻ!"
    },
    {
      avatar: "https://i.pravatar.cc/150?img=5",
      name: "Lê Văn C",
      text: "Mình cũng thấy vậy, cảm hứng quá!"
    },
    {
      avatar: "https://i.pravatar.cc/150?img=6",
      name: "Phạm D",
      text: "Ủng hộ bạn tiếp tục viết nhiều hơn nữa nha!"
    }
  ];

  return (
    <div className="post-detail-container">
      {/* post chính */}
      <div className="post-main">
        <div className="post-header">
          <img src={post.authorAvatar} alt="avatar" className="post-avatar" />
          <div className="post-author">
            <p className="author-name">{post.authorFN}</p>
            <p className="author-username">@{post.authorUN}</p>
          </div>
        </div>

        <div className="post-content">
          <p className="post-text">{post.content}</p>
          {post.image && (
            <img src={post.image} alt="post" className="post-image" />
          )}
        </div>
      </div>

      {/* comment */}
      <div className="post-comments">
        <h3 className="comment-heading">Comments</h3>
        {comments.map((cmt, index) => (
          <div key={index} className="comment">
            <img src={cmt.avatar} alt="avatar" className="comment-avatar" />
            <div className="comment-body">
              <p className="comment-name">{cmt.name}</p>
              <p className="comment-text">{cmt.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
