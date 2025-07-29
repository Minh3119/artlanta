import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SubmitCommissionModal from '../components/Commission/SubmitCommissionModal';
import SidebarHistory from '../components/Commission/SidebarHistory';
import { useNavigate } from 'react-router-dom';

const formatDatePretty = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

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
  const navigate = useNavigate();
  const [cancelLoading, setCancelLoading] = useState(false);

  // Handle commission cancellation
  const handleCancelCommission = async () => {
    if (!window.confirm('Are you sure you want to cancel this commission? This action cannot be undone.')) {
      return;
    }

    setCancelLoading(true);
    try {
      const res = await fetch(`http://localhost:9999/backend/api/commissions/${commissionId}/cancel`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) throw new Error('Failed to cancel commission');
      
      const data = await res.json();
      setCommission(data.commission);
      toast.success('Commission cancelled successfully');
      navigate('/commissiondashboard/commissions');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelLoading(false);
    }
  };

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
  const handleSubmitCommission = async (fileDeliveryURL) => {
    setSubmitLoading(true);
    try {
      // Check latest commission status before submitting
      const statusRes = await fetch(`http://localhost:9999/backend/api/commissions/${commissionId}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!statusRes.ok) throw new Error('Failed to check commission status');
      const statusData = await statusRes.json();
      const latestStatus = statusData.commission?.status;
      if (latestStatus !== 'IN_PROGRESS') {
        toast.error('This commission is no longer in progress. You cannot submit.');
        setShowSubmitModal(false);
        setSubmitLoading(false);
        return;
      }

      // Submit commission with URL
      const res = await fetch(`http://localhost:9999/backend/api/commissions/${commissionId}/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileDeliveryURL: fileDeliveryURL })
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
      <div className="w-full flex items-center px-4 pt-4">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow"
          onClick={() => navigate('/commissiondashboard/commissions')}
        >
          ← Back
        </button>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Details */}
          <div className="flex-1 ">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 ">
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
                      <span>Created {formatDatePretty(commission.createdAt)}</span>
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
              <div className="p-8  overflow-y-auto h-[70vh] mb-20">
                {/* Enhanced Participants Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {commission.artistAvatarURL ? (
                        <div className="relative">
                          <img src={commission.artistAvatarURL} alt={commission.artistUsername} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">🎨</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {commission.artistUsername?.charAt(0)?.toUpperCase() || 'A'}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">🎨</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-blue-600 font-bold uppercase tracking-wide">Artist</div>
                        <div className="text-xl font-bold text-gray-800">{commission.artistUsername}</div>
                        <div className="text-sm text-gray-500">Creative Professional</div>
                      </div>
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4">
                      {commission.clientAvatarURL ? (
                        <div className="relative">
                          <img src={commission.clientAvatarURL} alt={commission.clientUsername} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg" />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">👤</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {commission.clientUsername?.charAt(0)?.toUpperCase() || 'C'}
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">👤</span>
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-sm text-green-600 font-bold uppercase tracking-wide">Client</div>
                        <div className="text-xl font-bold text-gray-800">{commission.clientUsername}</div>
                        <div className="text-sm text-gray-500">Project Owner</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Description Section */}
                {commission.description && (
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <span className="text-2xl">📝</span>
                      Project Description
                    </h3>
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200 shadow-inner ">
                      {editMode ? (
                        <textarea
                          className="w-full min-h-[120px] p-4 border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                          value={editFields.description}
                          onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                          placeholder="Describe your commission requirements..."
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                          {commission.description}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Details Grid */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <span className="text-2xl">📅</span>
                      Timeline & Dates
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Deadline:</span>
                        <span className="font-bold text-blue-700">
                          {formatDatePretty(commission.deadline)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Created:</span>
                        <span className="font-bold text-green-700">
                          {formatDatePretty(commission.createdAt)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Last Updated:</span>
                        <span className="font-bold text-purple-700">
                          {formatDatePretty(commission.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      Status & Progress
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Current Status:</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(commission.status)}`}>
                          {commission.status?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 font-medium">Work Submitted:</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${commission.artistSeenFinal ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'}`}>
                          {commission.artistSeenFinal ? '✅ Yes' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                
                {/* Modal for submit commission */}
                <SubmitCommissionModal
                  open={showSubmitModal}
                  onClose={() => setShowSubmitModal(false)}
                  onSubmit={handleSubmitCommission}
                  loading={submitLoading}
                />

                {/* Enhanced File Delivery Section */}
                {commission.fileDeliveryURL && (
                  (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-xl">📎</span>
                        Final Delivery
                        <span className="ml-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Ready for Download
                        </span>
                      </h3>
                      <div className="bg-white rounded-xl p-4 border border-green-200">
                        <p className="text-gray-600 mb-4 font-medium">Your completed commission is ready! Click below to download the final files.</p>
                        <a 
                          href={commission.fileDeliveryURL} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          <span className="text-xl">📥</span>
                          Download Final Files
                          <span className="ml-2 bg-white/20 px-2 py-1 rounded-md text-sm">HD Quality</span>
                        </a>
                      </div>
                    </div>
                  )
                )}

              </div>
            </div>
          </div>

          {/* Sidebar: Commission History */}<div className="flex flex-col gap-8">
          <SidebarHistory 
            history={history} 
            historyLoading={historyLoading} 
            historyError={historyError} 
          />
          
          {/* Enhanced Action Buttons */}
                {commission.status === 'IN_PROGRESS' && (
                  <div className="w-[300px] h-[200px] flex flex-wrap gap-3 mb-8 p-6">
                    {editMode ? (
                      <>
                        <button
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          onClick={handleSave}
                        >
                          <span>💾</span> Save Changes
                        </button>
                        <button
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          onClick={() => {
                            setEditMode(false);
                            setEditFields({
                              title: commission.title || '',
                              description: commission.description || '',
                              price: commission.price || ''
                            });
                          }}
                        >
                          <span>❌</span> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          onClick={() => setEditMode(true)}
                        >
                          <span>✏️</span> Edit Details
                        </button>
                        <button
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                          onClick={handleCancelCommission}
                          disabled={cancelLoading}
                        >
                          <span>{cancelLoading ? '⏳' : '🚫'}</span>
                          {cancelLoading ? 'Cancelling...' : 'Cancel Commission'}
                        </button>
                      </>
                    )}
                    
                    {isArtist && (
                      <button
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        onClick={() => setShowSubmitModal(true)}
                      >
                        <span>🚀</span> Submit Work
                      </button>
                    )}
            
                  </div>
                )}
        </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CommissionDetailPage;