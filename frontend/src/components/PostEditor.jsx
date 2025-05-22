import React, { useState } from "react";
import axios from "axios";

function PostEditor({ existingPost, onSave }) {
  const [title, setTitle] = useState(existingPost?.title || "");
  const [content, setContent] = useState(existingPost?.content || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const savePost = async (status) => {
    setLoading(true);
    setMessage("");
    try {
      const post = { title, content, status };
      if (existingPost) {
        await axios.put(`/api/posts/${existingPost.id}`, post);
      } else {
        await axios.post("/api/posts", post);
      }
      setMessage(
        status === "draft" ? "Draft saved!" : "Post published!"
      );
      if (onSave) onSave();
    } catch (err) {
      setMessage("Error saving post.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>{existingPost ? "Edit Post" : "New Post"}</h2>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        disabled={loading}
      />
      <br />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Write your post..."
        rows={8}
        cols={40}
        disabled={loading}
      />
      <br />
      <button onClick={() => savePost("draft")} disabled={loading}>
        Save as Draft
      </button>
      <button onClick={() => savePost("published")} disabled={loading}>
        Publish
      </button>
      <div>{message}</div>
    </div>
  );
}

export default PostEditor;