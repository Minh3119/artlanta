import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../../styles/statistics.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AccountStatsPage() {
  const { userId } = useParams();
  const [stats, setStats] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [topCommenters, setTopCommenters] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9999/backend/api/statistics?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setTopPosts(data.topPosts || []);
        setTopCommenters(data.topCommenters || []);
      });
  }, [userId]);

  if (!stats) return <div>Loading...</div>;

  // Top Posts Chart Data (show up to 5)
  const topPostsChartData = {
    labels: topPosts.slice(0, 5).map(post => post.title ? post.title : `#${post.postId}`),
    datasets: [
      {
        label: "Likes",
        data: topPosts.slice(0, 5).map(post => post.likeInteractions),
        backgroundColor: "#38bdf8",
      },
      {
        label: "Comments",
        data: topPosts.slice(0, 5).map(post => post.commentInteractions),
        backgroundColor: "#fbbf24",
      },
    ],
  };

  // Top Commenters Chart Data (show up to 5)
  const topCommentersChartData = {
    labels: topCommenters.slice(0, 5).map(user => user.username ? user.username : `#${user.userId}`),
    datasets: [
      {
        label: "Likes",
        data: topCommenters.slice(0, 5).map(user => user.likeInteractions),
        backgroundColor: "#34d399",
      },
      {
        label: "Comments",
        data: topCommenters.slice(0, 5).map(user => user.commentInteractions),
        backgroundColor: "#f472b6",
      },
    ],
  };

  return (
    <div className="stats-container">
      <h2 className="stats-title">Account Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Posts</div>
          <div className="stat-value">{stats.posts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Followers</div>
          <div className="stat-value">{stats.followers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Following</div>
          <div className="stat-value">{stats.following}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Comments made</div>
          <div className="stat-value">{stats.commentsMade}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Replies received</div>
          <div className="stat-value">{stats.repliesReceived}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Likes received</div>
          <div className="stat-value">{stats.likesReceived}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Votes per post</div>
          <div className="stat-value">{stats.votesPerPost}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Flagged items</div>
          <div className="stat-value">{stats.flagsReceived}</div>
        </div>
      </div>

      {topPosts.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 className="stats-title" style={{ fontSize: "1.3rem" }}>Top Posts (Chart)</h3>
          <Bar data={topPostsChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      )}

      {topCommenters.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3 className="stats-title" style={{ fontSize: "1.3rem" }}>Top Commenters (Chart)</h3>
          <Bar data={topCommentersChartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
        </div>
      )}
    </div>
  );
}

export default AccountStatsPage;