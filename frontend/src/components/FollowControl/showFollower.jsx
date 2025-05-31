import React, { useState } from 'react';

const ShowFollowersButton = ({ targetId }) => {
  const [followers, setFollowers] = useState([]);
  const [visible, setVisible] = useState(false);

  const showFollowers = () => {
    fetch(`/api/follow?type=list&userId=${targetId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setFollowers(data);
        setVisible(true);
        console.log('Followers loaded:', data);
      });
  };

  return (
    <div>
      <button onClick={showFollowers}>Show Followers</button>
      {visible && (
        <ul>
          {followers.map((f) => (
            <li key={f.id}>
              Follower ID: {f.followerId}, At: {f.followAt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowFollowersButton;
