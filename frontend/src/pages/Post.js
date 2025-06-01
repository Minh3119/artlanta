import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:9999/backend/api/post', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
       
        if (data.error) {
          throw new Error(data.error);
        }

        setPosts(data.response || []);
        setLoading(false);
      } catch (err) {
        toast.error('Failed to load posts: ' + err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
        </div>

        {posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
              >
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-700 mb-1"><strong>User ID:</strong> {post.userId}</p>
                <p className="text-gray-700 mb-1"><strong>Content:</strong> {post.content}</p>
                <p className="text-gray-700 mb-1"><strong>Draft:</strong> {post.isDraft ? 'Yes' : 'No'}</p>
                <p className="text-gray-700 mb-1"><strong>Visibility:</strong> {post.visibility}</p>
                <p className="text-gray-700 mb-1"><strong>Created At:</strong> {post.createdAt}</p>
                <p className="text-gray-700 mb-1"><strong>Updated At:</strong> {post.updatedAt || 'N/A'}</p>
                <p className="text-gray-700"><strong>Deleted:</strong> {post.isDeleted ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PostListPage;
