import React, { useEffect, useState } from "react";
import axios from "axios";

function PublishedPostsList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/api/posts?status=published").then(res => {
      setPosts(res.data);
    });
  }, []);

  return (
    <div>
      <h2>Your Published Posts</h2>
      {posts.length === 0 && <div>No published posts yet.</div>}
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <strong>{post.title}</strong>
            <div>{post.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PublishedPostsList;