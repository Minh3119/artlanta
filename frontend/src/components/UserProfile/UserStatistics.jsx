import React, { useEffect, useState } from "react";

function AccountStatsPage({ userId }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/user-stats?userId=${userId}`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, [userId]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2>Account Statistics</h2>
      <ul>
        <li>Posts: {stats.posts}</li>
        <li>Followers: {stats.followers}</li>
        <li>Following: {stats.following}</li>
        <li>Likes Received: {stats.likesReceived}</li>
        <li>Comments Made: {stats.commentsMade}</li>
        <li>Comments/Replies received: {stats.repliesReceived}</li>
      </ul>
    </div>
  );
}

export default AccountStatsPage;