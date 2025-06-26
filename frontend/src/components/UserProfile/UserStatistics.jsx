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
  const [error, setError] = useState(null);

useEffect(() => {
  fetch(`http://localhost:9999/backend/api/statistics?`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then(async res => {
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An unknown error occurred.");
        return;
      }

      setStats(data);
      setTopPosts(data.topPosts || []);
      setTopCommenters(data.topCommenters || []);
    })
    .catch(err => {
      setError("Failed to connect to server.");
    });
}, [userId]);


  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;

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
        backgroundColor: "#6366f1", // Changed to indigo-500
      },
      {
        label: "Comments",
        data: topCommenters.slice(0, 5).map(user => user.commentInteractions),
        backgroundColor: "#f87171", // Changed to red-400
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
          <div className="stat-label">Likes per post</div>
          <div className="stat-value">{stats.votesPerPost}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Comments per post</div>
          <div className="stat-value">{stats.commentsPerPost}</div>
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