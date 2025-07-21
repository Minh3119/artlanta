import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SubmitCommissionModal from '../components/Commission/SubmitCommissionModal';

const CommissionDetailPage = () => {
  const { commissionId } = useParams();
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({ title: '', description: '', price: '' });
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  // Fetch current user ID and role on mount
  useEffect(() => {
    fetch('http://localhost:9999/backend/api/current-user', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.response && data.response.id) {
          setCurrentUserId(data.response.id);
          setCurrentUserRole(data.response.role);
        }
      })
      .catch(() => {
        setCurrentUserId(null);
        setCurrentUserRole(null);
      });
  }, []);

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

  // When commission loads, set editFields
  useEffect(() => {
    if (commission) {
      setEditFields({
        title: commission.title || '',
        description: commission.description || '',
        price: commission.price || ''
      });
    }
  }, [commission]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS': return '⏳';
      case 'COMPLETED': return '✅';
      case 'CANCELLED': return '❌';
      default: return '📋';
    }
  };

  const formatVND = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:9999/backend/api/commissions/${commissionId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editFields.title,
          description: editFields.description,
          price: Number(editFields.price)
        })
      });
      if (!res.ok) throw new Error('Failed to update commission');
      const data = await res.json();
      setCommission(data.commission);
      setEditMode(false);
      toast.success('Commission updated successfully!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isArtist = commission && currentUserId && currentUserRole === 'ARTIST' && commission.artistId === currentUserId;

  // Submit handler
  const handleSubmitCommission = async (finalFile, previewFile) => {
    setSubmitLoading(true);
    try {
      // Upload final file
      const finalForm = new FormData();
      finalForm.append('file[]', finalFile);
      const finalRes = await fetch('http://localhost:9999/backend/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: finalForm
      });
      const finalData = await finalRes.json();
      if (!finalRes.ok || !finalData.response || !Array.isArray(finalData.response) || !finalData.response[0]?.url) {
        throw new Error(finalData.error || 'Failed to upload final image');
      }
      const finalURL = finalData.response[0].url;

      // Upload preview file
      const previewForm = new FormData();
      previewForm.append('file[]', previewFile);
      const previewRes = await fetch('http://localhost:9999/backend/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: previewForm
      });
      const previewData = await previewRes.json();
      if (!previewRes.ok || !previewData.response || !Array.isArray(previewData.response) || !previewData.response[0]?.url) {
        throw new Error(previewData.error || 'Failed to upload preview image');
      }
      const previewURL = previewData.response[0].url;

      // Submit commission with URLs
      const res = await fetch(`http://localhost:9999/backend/api/commissions/${commissionId}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileDeliveryURL: finalURL, previewImageURL: previewURL })
      });
      if (!res.ok) throw new Error('Failed to submit commission');
      const data = await res.json();
      setCommission(data.commission);
      setShowSubmitModal(false);
      toast.success('Commission submitted successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading commission details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  if (!commission) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 text-6xl mb-4">📄</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Commission Found</h2>
        <p className="text-gray-600">The commission you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Details */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {editMode ? (
                        <input
                          className="border rounded px-2 py-1 w-full text-gray-800 font-bold text-2xl"
                          value={editFields.title}
                          onChange={e => setEditFields(f => ({ ...f, title: e.target.value }))}
                        />
                      ) : (
                        commission.title || `Commission #${commission.commissionId}`
                      )}
                    </h1>
                    <div className="flex items-center gap-4 text-blue-100">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{getStatusIcon(commission.status)}</span>
                        <span className="font-medium">{commission.status?.replace('_', ' ')}</span>
                      </span>
                      <span>•</span>
                      <span>Created {commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {editMode ? (
                        <input
                          type="number"
                          className="border rounded px-2 py-1 w-32 text-right font-bold text-xl"
                          value={editFields.price}
                          onChange={e => setEditFields(f => ({ ...f, price: e.target.value }))}
                        />
                      ) : (
                        formatVND(commission.price)
                      )}
                    </div>
                    <div className="text-blue-100 text-sm">Total Price (VND)</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Participants */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      {commission.artistAvatarURL ? (
                        <img src={commission.artistAvatarURL} alt={commission.artistUsername} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                          {commission.artistUsername?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Artist</div>
                        <div className="text-lg font-semibold text-gray-800">{commission.artistUsername}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                      {commission.clientAvatarURL ? (
                        <img src={commission.clientAvatarURL} alt={commission.clientUsername} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
                          {commission.clientUsername?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-gray-500 font-medium">Client</div>
                        <div className="text-lg font-semibold text-gray-800">{commission.clientUsername}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {commission.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                    <div className="bg-gray-50 rounded-xl p-6 text-gray-700 leading-relaxed">
                      {editMode ? (
                        <textarea
                          className="border rounded px-2 py-1 w-full min-h-[80px] text-gray-800"
                          value={editFields.description}
                          onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                        />
                      ) : (
                        commission.description
                      )}
                    </div>
                  </div>
                )}

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">📅</span>
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Deadline:</span>
                        <span className="font-medium">
                          {commission.deadline ? new Date(commission.deadline).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">
                          {commission.createdAt ? new Date(commission.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Updated:</span>
                        <span className="font-medium">
                          {commission.updatedAt ? new Date(commission.updatedAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">📁</span>
                      Files & Status
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(commission.status)}`}>
                          {commission.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Artist Final:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${commission.artistSeenFinal ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {commission.artistSeenFinal ? 'Complete' : 'Pending'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Client Confirmed:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${commission.clientConfirmed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {commission.clientConfirmed ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit & Submit Buttons - Only show if IN_PROGRESS */}
                {commission.status === 'IN_PROGRESS' && (
                  <div className="flex gap-4 mb-8 justify-between">
                    {editMode ? (
                      <>
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors"
                          onClick={handleSave}
                        >Save</button>
                        <button
                          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors"
                          onClick={() => {
                            setEditMode(false);
                            setEditFields({
                              title: commission.title || '',
                              description: commission.description || '',
                              price: commission.price || ''
                            });
                          }}
                        >Cancel</button>
                      </>
                    ) : (
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors"
                        onClick={() => setEditMode(true)}
                      >Edit</button>
                    )}
                    {/* Only artist can see submit button */}
                    {isArtist && (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-colors"
                        onClick={() => setShowSubmitModal(true)}
                      >Submit</button>
                    )}
                  </div>
                )}
                {/* Modal for submit commission */}
                <SubmitCommissionModal
                  open={showSubmitModal}
                  onClose={() => setShowSubmitModal(false)}
                  onSubmit={handleSubmitCommission}
                  loading={submitLoading}
                />

                {/* File Delivery */}
                {commission.fileDeliveryURL && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">📎</span>
                      Final Delivery
                    </h3>
                    <a 
                      href={commission.fileDeliveryURL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <span>📥</span>
                      Download Final File
                    </a>
                  </div>
                )}
                {/* Preview Delivery */}
                {commission.previewImageURL && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">🖼️</span>
                      Preview (Watermarked)
                    </h3>
                    <a
                      href={commission.previewImageURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <span>👁️</span>
                      View Preview Image
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Commission History */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 text-white">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  History
                </h3>
                <p className="text-gray-300 text-sm mt-1">Track all changes made to this commission</p>
              </div>

              <div className="p-6">
                {historyLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Loading history...</p>
                  </div>
                ) : historyError ? (
                  <div className="text-center py-8">
                    <div className="text-red-500 text-2xl mb-2">⚠️</div>
                    <p className="text-red-600 text-sm">{historyError}</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-3">📝</div>
                    <p className="text-gray-500 text-sm">No edits yet</p>
                    <p className="text-gray-400 text-xs mt-1">Changes will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {history.map((h, idx) => (
                      <div key={h.id || idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-gray-800 bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                                {h.changedField}
                              </span>
                              <span className="text-gray-400">→</span>
                            </div>
                            <div className="space-y-1 mb-3">
                              <div className="text-xs text-gray-500 line-through bg-red-50 px-2 py-1 rounded">
                                {h.oldValue || 'null'}
                              </div>
                              <div className="text-xs text-gray-700 bg-green-50 px-2 py-1 rounded font-medium">
                                {h.newValue || 'null'}
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                              <span>User #{h.changedBy}</span>
                              <span>{h.changedAt ? new Date(h.changedAt).toLocaleString() : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CommissionDetailPage; 