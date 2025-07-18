import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CommissionListPage = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:9999/backend/api/commissions', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch commissions');
        return res.json();
      })
      .then((data) => {
        setCommissions(data.commissions || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-xl mx-auto mt-8 text-center">
      Error: {error}
    </div>
  );
  if (!commissions.length) return (
    <div className="text-center text-gray-500 text-lg mt-8">No commissions found.</div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Commissions</h2>
      <ul className="space-y-4">
        {commissions.map((commission) => (
          <li
            key={commission.commissionId}
            className="bg-white shadow-md rounded-lg p-5 cursor-pointer transition hover:shadow-xl border border-gray-100"
            onClick={() => navigate(`/commissions/${commission.commissionId}`)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xl font-semibold text-gray-800">{commission.title || `Commission #${commission.commissionId}`}</span>
              <span className="mt-2 sm:mt-0 text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium w-fit">{commission.status}</span>
            </div>
            <div className="mt-2 text-gray-600 text-sm">Price: ${commission.price?.toFixed(2) ?? 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommissionListPage; 