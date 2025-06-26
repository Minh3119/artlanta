import React, { useState, useEffect } from 'react';

export default function JsonHero() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAndUpload = async () => {
    setLoading(true);
    setError(null);

    try {
      // Gọi API backend với cookie được gửi kèm
      const getRes = await fetch('http://localhost:9999/backend/api/admin/statics', {
        method: 'GET',
        credentials: 'include'
      });

      if (!getRes.ok) throw new Error('Lỗi khi lấy dữ liệu từ backend');
      const jsonData = await getRes.json();

      // Gửi dữ liệu lên jsonbin
      const postRes = await fetch('https://api.jsonbin.io/v3/b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': '$2a$10$dfRXwyigCwqV1EgV1yqB6uQlLjfZK5f1TUDl6ojfXioaY96t.V83a',
          'X-Bin-Private': 'false'
        },
        body: JSON.stringify({ record: jsonData })
      });

      if (!postRes.ok) throw new Error('Lỗi khi upload dữ liệu lên JSONBin');
      const postData = await postRes.json();

      const binId = postData.metadata.id;
      const rawUrl = `https://api.jsonbin.io/v3/b/${binId}`;
      const jsonHeroUrl = `https://jsonhero.io/new?url=${encodeURIComponent(rawUrl)}`;
      setUrl(jsonHeroUrl);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndUpload();
  }, []);

  return (
    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 6, marginLeft: '40px', minHeight: '700px' }}>
      {loading && <p>Đang tạo giao diện</p>}
      {url && (
        <iframe
          src={url}
          title="JsonHero Viewer"
          width="100%"
          height="600px"
          style={{ border: '1px solid #ccc', marginTop: 10, borderRadius: 4, minHeight: '830px' }}
        />
      )}
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
    </div>
  );
}
