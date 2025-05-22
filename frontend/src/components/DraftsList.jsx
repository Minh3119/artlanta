import React, { useEffect, useState } from "react";
import axios from "axios";
import PostEditor from "./PostEditor";

function DraftsList() {
  const [drafts, setDrafts] = useState([]);
  const [editingDraft, setEditingDraft] = useState(null);

  const fetchDrafts = async () => {
    const res = await axios.get("/api/posts?status=draft");
    setDrafts(res.data);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  if (editingDraft) {
    return (
      <PostEditor
        existingPost={editingDraft}
        onSave={() => {
          setEditingDraft(null);
          fetchDrafts();
        }}
      />
    );
  }

  return (
    <div>
      <h2>Your Drafts</h2>
      {drafts.length === 0 && <div>No drafts yet.</div>}
      <ul>
        {drafts.map(draft => (
          <li key={draft.id}>
            <strong>{draft.title || "(No title)"}</strong>
            <button onClick={() => setEditingDraft(draft)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DraftsList; 