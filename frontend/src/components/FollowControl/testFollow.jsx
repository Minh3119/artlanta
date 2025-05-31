import React, { useState } from 'react';

const FollowToggleButton = ({ targetId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleFollow = () => {
    const action = isFollowing ? 'unfollow' : 'follow';

    fetch('/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `action=${action}&targetId=${targetId}`,
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsFollowing(!isFollowing);
          console.log(`${action} success`);
        } else {
          alert('Follow/unfollow failed');
        }
      });
  };

  return (
    <button onClick={toggleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default testFollow;
