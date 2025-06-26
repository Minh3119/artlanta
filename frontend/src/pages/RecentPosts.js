import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/HomePage/Header';
import { toast } from 'react-toastify';
import '../styles/homepage.css';

export default function RecentPosts() {
  const [viewedPosts, setViewedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const response = await fetch('http://localhost:9999/backend/api/history/get', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch recent posts');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Fetch post details bằng cách lặp qua lịch sử đã xem
      const postPromises = data.history.map(entry =>
        fetch(`http://localhost:9999/backend/api/post/view/${entry.postId}`, {
          credentials: 'include'
        })
        .then(res => res.json())
        .then(postData => ({
          ...postData.response,
          viewedAt: entry.viewedAt
        }))
      );

      const postResults = await Promise.all(postPromises);
      const validPosts = postResults
        .filter(post => post && !post.error) // Lọc các bài viết hợp lệ
        .sort((a, b) => new Date(b.viewedAt) - new Date(a.viewedAt)); // Sắp xếp theo thời gian xem gần nhất
      
      setViewedPosts(validPosts);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Chuyển string thành định dạng Date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  //-------------------Phần render component-------------------
  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-time">
        <p>Recent Posts</p>
      </div>
      <div className="homepage-title">Your Recently Viewed Posts</div>
      
      {loading ? (
        <div className="loading-container">
          <span>Loading...</span>
        </div>
      ) : viewedPosts.length === 0 ? (
        <div className="no-posts-message">
          <p>No recently viewed posts</p>
        </div>
      ) : (
        <div className="recent-posts-list">
          {viewedPosts.map((post) => (
            <Link to={`/post/${post.postID}`} key={post.postID + post.viewedAt} className="recent-post-item">
              <div className="recent-post-content">
                <div className="recent-post-header">
                  <img src={post.authorAvatar} alt={post.authorFN} className="recent-post-avatar" />
                  <div className="recent-post-info">
                    <h3>{post.authorFN}</h3>
                    <span className="recent-post-time">Viewed on {formatDate(post.viewedAt)}</span>
                  </div>
                </div>
                <p className="recent-post-text">{post.content}</p>
                {post.mediaURL && post.mediaURL.length > 0 && (
                  <img src={post.mediaURL[0]} alt="Post preview" className="recent-post-preview" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 