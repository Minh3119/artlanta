import React, { useEffect, useState } from 'react';
import { AlertTriangle, Home, Eye, Ban } from 'lucide-react';

function ModeratorDashboard() {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:9999/backend/api/post/report', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setReportedPosts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report data:', err);
        setLoading(false);
      });
  }, []);

  const handleRemovePost = (postId) => {
  fetch(`http://localhost:9999/backend/api/post/delete?postID=${postId}`, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setReportedPosts((posts) =>
          posts.filter((post) => post.postId !== postId)
        );
      } else {
        console.error('Failed to delete post:', data.message);
      }
    })
    .catch((err) => {
      console.error('Error deleting post:', err);
    });
};


  const handleViewPost = (postId) => {
    window.location.href = `/post/${postId}`;
  };

  const getPriorityLevel = (count) => {
    if (count >= 500) return { level: 'High', color: 'text-red-600' };
    if (count >= 100) return { level: 'Medium', color: 'text-orange-500' };
    return { level: 'Low', color: 'text-yellow-600' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-gray-600 font-medium">Loading reported posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-800">Moderator Dashboard</h1>
            </div>
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{reportedPosts.length}</div>
              <div className="text-sm text-red-700">Total Reported Posts</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {reportedPosts.filter(p => p.reportCount >= 10).length}
              </div>
              <div className="text-sm text-orange-700">High Priority</div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
               
              </div>
              <div className="text-sm text-blue-700"></div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {reportedPosts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
            <div className="text-gray-400 mb-4">
              <AlertTriangle className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-xl text-gray-500">No reported posts found</p>
            <p className="text-gray-400 mt-2">All clear! 🎉</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reportedPosts.map((post, index) => {
              const priority = getPriorityLevel(post.reportCount);
              return (
                <div
                  key={index}
                  className="bg-white border-l-4 border-red-400 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        Post ID: {post.postId}
                      </h3>
                    </div>
                    <div className={`flex items-center space-x-1 ${priority.color}`}>
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">{priority.level}</span>
                    </div>
                  </div>

                  {/* Content Preview */}
                  {post.content && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="text-sm text-gray-600 mb-1">Content Preview:</div>
                      <div className="text-gray-800 text-sm line-clamp-2">
                        {post.content}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Top Reason:</span>
                      <span className="font-medium text-red-600">{post.topReason}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Report Count:</span>
                      <span className="font-bold text-red-700">{post.reportCount}</span>
                    </div>
                    {post.author && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Author:</span>
                        <span className="font-medium text-gray-800">{post.author}</span>
                      </div>
                    )}
                    {post.createdAt && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-800">{post.createdAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewPost(post.postId)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg flex-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Post</span>
                    </button>
                    <button
                      onClick={() => handleRemovePost(post.postId)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg flex-1"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Remove Post</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ModeratorDashboard;