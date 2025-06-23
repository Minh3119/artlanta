import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AccountStatsPage() {
  const { userId } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9999/backend/api/statistics?userId=${userId}`)
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