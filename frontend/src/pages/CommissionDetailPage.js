import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCallback } from 'react';

const CommissionDetailPage = () => {
  const { commissionId } = useParams();
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:9999/backend/api/commissions/${commissionId}`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch commission details');
        return res.json();
      })
      .then((data) => {
        setCommission(data.commission);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
    // Fetch commission history
    setHistoryLoading(true);
    setHistoryError(null);
    fetch(`http://localhost:9999/backend/api/commissions/${commissionId}/history`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch commission history');
        return res.json();
      })
      .then((data) => {
        setHistory(data.history || []);
        setHistoryLoading(false);
      })
      .catch((err) => {
        setHistoryError(err.message);
        setHistoryLoading(false);
      });
  }, [commissionId]);

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
  if (!commission) return (
    <div className="text-center text-gray-500 text-lg mt-8">No commission found.</div>
  );

  return (
    <div className="max-w-6xl mx-auto mt-8 flex gap-8">
      {/* Main Details */}
      <div className="flex-1">
        <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold mb-4">Commission Details</h2>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center gap-3">
              {commission.artistAvatarURL && (
                <img src={commission.artistAvatarURL} alt={commission.artistUsername} className="w-12 h-12 rounded-full object-cover border" />
              )}
              <span className="font-medium text-gray-700">Artist: {commission.artistUsername}</span>
            </div>
            <div className="flex items-center gap-3">
              {commission.clientAvatarURL && (
                <img src={commission.clientAvatarURL} alt={commission.clientUsername} className="w-12 h-12 rounded-full object-cover border" />
              )}
              <span className="font-medium text-gray-700">Client: {commission.clientUsername}</span>
            </div>
          </div>
          <hr className="my-4" />
          <div className="mb-2">
            <span className="text-xl font-semibold text-gray-800">{commission.title || `Commission #${commission.commissionId}`}</span>
          </div>
          <div className="mb-4 text-gray-600">{commission.description}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div><span className="font-semibold">Status:</span> {commission.status}</div>
            <div><span className="font-semibold">Price:</span> ${commission.price?.toFixed(2) ?? 'N/A'}</div>
            <div><span className="font-semibold">Deadline:</span> {commission.deadline ? new Date(commission.deadline).toLocaleString() : 'N/A'}</div>
            <div><span className="font-semibold">File Delivery:</span> {commission.fileDeliveryURL ? <a href={commission.fileDeliveryURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a> : 'N/A'}</div>
          </div>
          <hr className="my-4" />
          <div className="text-sm text-gray-500">Created at: {commission.createdAt ? new Date(commission.createdAt).toLocaleString() : 'N/A'}</div>
          <div className="text-sm text-gray-500">Last updated: {commission.updatedAt ? new Date(commission.updatedAt).toLocaleString() : 'N/A'}</div>
        </div>
      </div>
      {/* Sidebar: Commission History */}
      <aside className="w-full max-w-xs">
        <div className="bg-gray-50 shadow rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Edit History</h3>
          {historyLoading ? (
            <div className="text-gray-400 text-center">Loading history...</div>
          ) : historyError ? (
            <div className="text-red-500 text-center">{historyError}</div>
          ) : history.length === 0 ? (
            <div className="text-gray-400 text-center">No edits yet.</div>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
              {history.map((h, idx) => (
                <li key={h.id || idx} className="bg-white rounded p-3 border border-gray-100 shadow-sm">
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">{h.changedField}</span> changed
                  </div>
                  <div className="text-xs text-gray-500 mb-1">
                    <span className="line-through text-red-400">{h.oldValue}</span> → <span className="text-green-600">{h.newValue}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    By User ID: {h.changedBy} <br />
                    At: {h.changedAt ? new Date(h.changedAt).toLocaleString() : 'N/A'}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
};

export default CommissionDetailPage; 