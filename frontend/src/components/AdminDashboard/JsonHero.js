import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function JsonHero() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndUpload = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:9999/backend/api/admin/statics');
      const jsonData = response.data;

      const res = await axios.post(
        'https://api.jsonbin.io/v3/b',
        { record: jsonData },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': '$2a$10$dfRXwyigCwqV1EgV1yqB6uQlLjfZK5f1TUDl6ojfXioaY96t.V83a',
            'X-Bin-Private': 'false',
          },
        }
      );

      const binId = res.data.metadata.id;
      const rawUrl = `https://api.jsonbin.io/v3/b/${binId}`;
      const jsonHeroUrl = `https://jsonhero.io/new?url=${encodeURIComponent(rawUrl)}`;
      setUrl(jsonHeroUrl);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndUpload();
  }, []);

  return (
    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 6, marginLeft:'40px' , minHeight:'700px' }}>
      {loading && <p>Đang tạo giao diện</p>}

      {url && (
        <>
          <iframe
            src={url}
            title="JsonHero Viewer"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', marginTop: 10, borderRadius: 4, minHeight:'830px'}}
          />
        </>
      )}

      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
    </div>
  );
}
