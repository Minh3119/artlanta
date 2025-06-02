import React, { useState, useEffect } from 'react';

const FollowToggleButton = ({ targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkFollowStatus();
  }, [targetUserId]);

  const checkFollowStatus = () => {
    setIsLoading(true);
    fetch(`http://localhost:9999/backend/api/follow?type=status&userId=${targetUserId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Please log in to follow users');
          }
          throw new Error('Failed to check follow status');
        }
        return res.json();
      })
      .then((data) => {
        setIsFollowing(data.isFollowing);
        setError(null);
      })
      .catch((err) => {
        console.error('Error checking follow status:', err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleToggleFollow = () => {
    if (isLoading) return;

    setIsLoading(true);
    const action = isFollowing ? 'unfollow' : 'follow';

    fetch('http://localhost:9999/backend/api/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `action=${action}&targetId=${targetUserId}`,
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Please log in to follow users');
          }
          throw new Error(`Failed to ${action} user`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setIsFollowing(!isFollowing);
          setError(null);
        } else {
          throw new Error(`Failed to ${action} user`);
        }
      })
      .catch((err) => {
        console.error(`Error ${action}ing user:`, err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (error) {
    return <div className="text-red-600 text-sm">{error}</div>;
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
        isFollowing
          ? 'bg-gray-200 hover:bg-red-100 hover:text-red-600'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <span>Loading...</span>
      ) : isFollowing ? (
        <span>Following</span>
      ) : (
        <span>Follow</span>
      )}
    </button>
  );
};

export default FollowToggleButton;
