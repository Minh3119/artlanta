import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const CommissionListPage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // <-- add this
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();

  // Fetch commissions when selectedStatus changes
  useEffect(() => {
    if (!selectedStatus) {
      setCommissions([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`http://localhost:9999/backend/api/commissions?status=${selectedStatus}`, {
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
  }, [selectedStatus]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatVND = (amount) => {
    if (typeof amount !== 'number') return 'N/A';
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Status card click handler
  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  // Status card data
  const statusCards = [
    {
      label: 'In Progress',
      status: 'IN_PROGRESS',
      color: 'text-blue-600',
      border: 'border-blue-400',
      icon: '⏳',
    },
    {
      label: 'Completed',
      status: 'COMPLETED',
      color: 'text-green-600',
      border: 'border-green-400',
      icon: '✅',
    },
    {
      label: 'Cancelled',
      status: 'CANCELLED',
      color: 'text-red-600',
      border: 'border-red-400',
      icon: '❌',
    },
  ];

  // Check if user is logged in
  useEffect(() => {
    setAuthLoading(true);
    fetch('http://localhost:9999/backend/api/current-user', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.response && data.response.id) {
          setCurrentUserId(data.response.id);
        } else {
          setCurrentUserId(null);
        }
        setAuthLoading(false);
      })
      .catch(() => {
        setCurrentUserId(null);
        setAuthLoading(false);
      });
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUserId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full flex items-center px-4 pt-4">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm shadow"
          onClick={() => navigate('/homepage')}
        >
          ← Back to Home
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8 w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Commissions</h1>
          <p className="text-gray-600">Manage and track all your art commissions</p>
        </div>

        {/* Status selection cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {statusCards.map((card) => (
            <div
              key={card.status}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer flex flex-col items-center transition-all duration-150 ${card.border} ${selectedStatus === card.status ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'}`}
              onClick={() => handleStatusClick(card.status)}
              style={{ minHeight: 120 }}
            >
              <div className={`text-4xl mb-2 ${card.color}`}>{card.icon}</div>
              <div className={`text-xl font-bold mb-1 ${card.color}`}>{card.label}</div>
              {selectedStatus === card.status && <div className="text-xs text-blue-500 mt-1">Selected</div>}
            </div>
          ))}
        </div>

        {/* Loading, error, or prompt */}
        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading your commissions...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          </div>
        )}
        {!selectedStatus && !loading && !error && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="text-center">
              <div className="text-gray-400 text-6xl mb-4">🎨</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Choose a status to view your commissions</h2>
              <p className="text-gray-600">Click a status card above to see your commissions.</p>
            </div>
          </div>
        )}

        {/* Commission List */}
        {selectedStatus && !loading && !error && (
          <div className="grid gap-6">
            {commissions.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-5xl mb-2">🗂️</div>
                <div className="text-lg font-semibold mb-1">No commissions found for this status.</div>
                <div className="text-gray-400">Try another status or create a new commission!</div>
              </div>
            ) : (
              commissions.map((commission) => (
                <div
                  key={commission.commissionId}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => navigate(`/commissions/${commission.commissionId}`)}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left side - Commission info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Status indicator */}
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              commission.status === 'COMPLETED' ? 'bg-green-500' :
                              commission.status === 'CANCELLED' ? 'bg-red-500' :
                              'bg-blue-500'
                            }`}></div>
                          </div>

                          {/* Commission details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {commission.title || `Commission #${commission.commissionId}`}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(commission.status)}`}>
                                <span className="mr-1">{getStatusIcon(commission.status)}</span>
                                {commission.status?.replace('_', ' ')}
                              </span>
                            </div>

                            {/* Description */}
                            {commission.description && (
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {commission.description}
                              </p>
                            )}

                            {/* Participants */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Artist:</span>
                                <div className="flex items-center gap-2">
                                  {commission.artistAvatarURL ? (
                                    <img src={commission.artistAvatarURL} alt={commission.artistUsername} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                      {commission.artistUsername?.charAt(0)?.toUpperCase() || 'A'}
                                    </div>
                                  )}
                                  <span>{commission.artistUsername}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Client:</span>
                                <div className="flex items-center gap-2">
                                  {commission.clientAvatarURL ? (
                                    <img src={commission.clientAvatarURL} alt={commission.clientUsername} className="w-6 h-6 rounded-full object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                                      {commission.clientUsername?.charAt(0)?.toUpperCase() || 'C'}
                                    </div>
                                  )}
                                  <span>{commission.clientUsername}</span>
                                </div>
                              </div>
                            </div>

                            {/* Timeline */}
                            <div className="flex items-center gap-4 text-xs text-gray-400">
                              <span>Created: {formatDate(commission.createdAt)}</span>
                              {commission.deadline && (
                                <>
                                  <span>•</span>
                                  <span>Deadline: {formatDate(commission.deadline)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Price and actions */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-800">
                            {formatVND(commission.price)}
                          </div>
                          <div className="text-sm text-gray-500">Total Price (VND)</div>
                        </div>

                        {/* Quick status indicators */}
                        <div className="flex gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            commission.artistSeenFinal ? 'bg-green-500' : 'bg-gray-300'
                          }`} title={commission.artistSeenFinal ? 'Artist completed' : 'Artist pending'}></div>
                          <div className={`w-2 h-2 rounded-full ${
                            commission.clientConfirmed ? 'bg-green-500' : 'bg-gray-300'
                          }`} title={commission.clientConfirmed ? 'Client confirmed' : 'Client pending'}></div>
                        </div>

                        {/* View button */}
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm">
                          View Details →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Click on any commission to view detailed information and history</p>
        </div>
      </div>
    </div>
  );
};

export default CommissionListPage;