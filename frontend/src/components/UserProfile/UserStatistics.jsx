import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/statistics.css";

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
    <div className="stats-container">
      <h2 className="stats-title">Account Statistics</h2>
      <ul className="stats-list">
        <li>Posts: {stats.posts}</li> 
        <li>Followers: {stats.followers}</li> 
        <li>Following: {stats.following}</li> 
        <li>Likes Received: {stats.likesReceived}</li> 
        <li>Comments Made: {stats.commentsMade}</li> 
        <li>Comments/Replies received: {stats.repliesReceived}</li> 
        <li>Warning/Bans: {stats.flagsReceived}</li> 
        <li>Upvotes/Downvotes per post: {stats.votesPerPost}</li> 
      </ul>
    </div>
  );
}

export default AccountStatsPage;