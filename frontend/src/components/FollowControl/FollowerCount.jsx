import React, { useEffect, useState } from 'react';

const FollowerCount = ({ userId }) => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCount = () => {
    setIsLoading(true);
    fetch(`/api/follow?type=count&userId=${userId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch follower count');
        }
        return res.json();
      })
      .then((data) => {
        if (data.count !== undefined) {
          setCount(data.count);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      })
      .catch((err) => {
        console.error('Error fetching follower count:', err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchCount();
  }, [userId]);

  if (isLoading) {
    return <span className="text-gray-500">Loading...</span>;
  }

  if (error) {
    return <span className="text-red-600 text-sm">{error}</span>;
  }

  return (
    <span className="font-medium">
      {count.toLocaleString()} follower{count !== 1 ? 's' : ''}
    </span>
  );
};

export default FollowerCount;
