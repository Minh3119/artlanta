import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";
const CommissionListPage = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();
const {
  requests,
  refreshFlag,
  triggerRefresh,
  compage
} = useOutletContext();
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
      case 'IN_PROGRESS': return 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white';
      case 'COMPLETED': return 'bg-gradient-to-r from-emerald-500 to-green-400 text-white';
      case 'CANCELLED': return 'bg-gradient-to-r from-red-500 to-pink-400 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-slate-400 text-white';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'IN_PROGRESS': return '⚡';
      case 'COMPLETED': return '🎉';
      case 'CANCELLED': return '💔';
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

  // Status card data with enhanced colors
  const statusCards = [
    {
      label: 'In Progress',
      status: 'IN_PROGRESS',
      bgGradient: 'bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600',
      textColor: 'text-white',
      hoverGradient: 'hover:from-blue-500 hover:via-purple-600 hover:to-indigo-700',
      icon: '⚡',
      shadow: 'shadow-blue-300',
    },
    {
      label: 'Completed',
      status: 'COMPLETED',
      bgGradient: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600',
      textColor: 'text-white',
      hoverGradient: 'hover:from-emerald-500 hover:via-green-600 hover:to-teal-700',
      icon: '🎉',
      shadow: 'shadow-green-300',
    },
    {
      label: 'Cancelled',
      status: 'CANCELLED',
      bgGradient: 'bg-gradient-to-br from-red-400 via-pink-500 to-rose-600',
      textColor: 'text-white',
      hoverGradient: 'hover:from-red-500 hover:via-pink-600 hover:to-rose-700',
      icon: '💔',
      shadow: 'shadow-red-300',
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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 opacity-20 animate-pulse"></div>
          </div>
          <p className="text-white font-semibold text-lg">Loading your amazing commissions...</p>
        </div>
      </div>
    );
  }

  if (!currentUserId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen relative" >
      {/* Fixed scrollable container */}
      <div className="h-screen overflow-y-auto scrollbar-hide"style={{ paddingBottom: '100px' }}>
        {/* Abstract Background Elements */}

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 w-full">
          {/* Header with enhanced styling */}
          <div className="text-center mb-12">
            <div className="inline-block">
             <h2 className="text-2xl font-black text-black mb-4 drop-shadow-lg">
                ✨ My Commissions ✨
              </h2>
              <div className="h-1 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full"></div>
            </div>
            <p className="text-black /80 text-lg mt-4 font-medium">Manage and track your creative projects</p>
          </div>

          {/* Enhanced Status selection cards */}
          <div class="grid grid-cols-1 md:grid-cols-[repeat(3,minmax(0,150px))] gap-4 justify-center pb-[30px]">
  {statusCards.map((card) => (
    <div
      key={card.status}
      className={`${card.bgGradient} ${card.hoverGradient} rounded-2xl p-6 cursor-pointer flex flex-col items-center transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${card.shadow} shadow-md ${selectedStatus === card.status ? 'ring-4 ring-white/50 scale-100 -translate-y-0.5' : ''}`}
      onClick={() => handleStatusClick(card.status)}
      style={{ width: '10rem', height: '10rem', margin: '0 auto' }}
    >
      <div className="text-4xl mb-2 animate-bounce">{card.icon}</div>
      <div className={`text-base font-bold mb-1 ${card.textColor}`}>{card.label}</div>
      {selectedStatus === card.status && (
        <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
          <div className="text-xs text-white font-semibold">✓ Selected</div>
        </div>
      )}
      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  ))}
</div>

          {/* Loading, error, or prompt with enhanced styling */}
          {loading && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                <div className="relative mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 opacity-20 animate-pulse"></div>
                </div>
                <p className="text-white font-bold text-xl">🎨 Loading your masterpieces...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-3xl shadow-2xl p-12 max-w-md mx-4 border border-white/20">
                <div className="text-white text-6xl mb-6 text-center">🚨</div>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Oops! Something went wrong</h2>
                <p className="text-white/90 text-center">{error}</p>
              </div>
            </div>
          )}

          {!selectedStatus && !loading && !error && (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20">
                <div className="text-white text-8xl mb-6 animate-pulse">🎨</div>
                <h2 className="text-3xl font-bold text-black mb-4">Choose Your Adventure!</h2>
                <p className="text-black/80 text-lg">Click a colorful status card above to explore your commissions</p>
              </div>
            </div>
          )}

          {/* Enhanced Commission List */}
          {selectedStatus && !loading && !error && (
            <div className="grid gap-8 pb-8">
              {commissions.length === 0 ? (
                <div className="text-center text-black py-16 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20">
                  <div className="text-8xl mb-4">🗂️</div>
                  <div className="text-2xl font-bold mb-2">No commissions found for this status</div>
                  <div className="text-black/70 text-lg">Time to create something amazing!</div>
                </div>
              ) : (
                commissions.map((commission) => (
                  <div
                    key={commission.commissionId}
                    className="bg-white/15 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-1 shadow-2xl"
                    onClick={() => navigate(`/${compage}/commissions/${commission.commissionId}`)}
                  >
                    <div className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left side - Commission info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-6">
                            {/* Enhanced status indicator */}
                            <div className="flex-shrink-0">
                              <div className={`w-4 h-4 rounded-full shadow-lg ${
                                commission.status === 'COMPLETED' ? 'bg-gradient-to-r from-emerald-400 to-green-500' :
                                commission.status === 'CANCELLED' ? 'bg-gradient-to-r from-red-400 to-pink-500' :
                                'bg-gradient-to-r from-blue-400 to-cyan-500'
                              } animate-pulse`}></div>
                            </div>

                            {/* Commission details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-4 mb-3">
                                <h3 className="text-2xl font-bold text-black group-hover:text-yellow-300 transition-colors">
                                  {commission.title || `Commission #${commission.commissionId}`}
                                </h3>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 border-white/30 ${getStatusColor(commission.status)} shadow-lg`}>
                                  <span className="mr-2">{getStatusIcon(commission.status)}</span>
                                  {commission.status?.replace('_', ' ')}
                                </span>
                              </div>

                              {/* Description */}
                              {commission.description && (
                                <p className="text-black /90 text-base mb-4 line-clamp-2 leading-relaxed">
                                  {commission.description}
                                </p>
                              )}

                              {/* Enhanced Participants */}
                              <div className="flex items-center gap-8 text-sm text-black/80 mb-4">
                                <div className="flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                                  <span className="font-bold text-purple-300 text-xl">Artist:</span>
                                  <div className="text-xl flex items-center gap-2 t">
                                    {commission.artistAvatarURL ? (
                                      <img src={commission.artistAvatarURL} alt={commission.artistUsername} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white/30">
                                        {commission.artistUsername?.charAt(0)?.toUpperCase() || 'A'}
                                      </div>
                                    )}
                                    <span className="font-semibold">{commission.artistUsername}</span>
                                  </div>
                                </div>
                                <div className="text-xl flex items-center gap-3 bg-white/10 rounded-full px-4 py-2">
                                  <span className="font-bold text-cyan-300 text-xl">Client:</span>
                                  <div className="flex items-center gap-2">
                                    {commission.clientAvatarURL ? (
                                      <img src={commission.clientAvatarURL} alt={commission.clientUsername} className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-black text-xl font-bold border-2 border-white/30 ">
                                        {commission.clientUsername?.charAt(0)?.toUpperCase() || 'C'}
                                      </div>
                                    )}
                                    <span className="font-semibold">{commission.clientUsername}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Enhanced Timeline */}
                              <div className="flex items-center gap-6 text-sm text-black/70 bg-white/5 rounded-xl px-4 py-2">
                                <span className="flex items-center gap-2 text-base">
                                  <span className="text-green-400">📅</span>
                                  Created: {formatDate(commission.createdAt)}
                                </span>
                                {commission.deadline && (
                                  <>
                                    <span className="text-white/50">•</span>
                                    <span className="flex items-center gap-2 text-black text-base">
                                      <span className="text-orange-400">⏰</span>
                                      Deadline: {formatDate(commission.deadline)}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right side - Price and actions */}
                        <div className="flex flex-col items-end gap-4">
                          <div className="text-right bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-4 shadow-lg">
                            <div className="text-3xl font-black text-white drop-shadow-lg">
                              {formatVND(commission.price)}
                            </div>
                            <div className="text-sm text-white/90 font-semibold">Total Price (VND)</div>
                          </div>

                          {/* Enhanced status indicators */}
                          <div className="flex gap-3 bg-white/10 rounded-full px-4 py-2">
                            <div className={`w-3 h-3 rounded-full border-2 border-white/30 ${
                              commission.artistSeenFinal ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-green-400/50' : 'bg-gray-400'
                            } shadow-lg`} title={commission.artistSeenFinal ? 'Artist completed' : 'Artist pending'}></div>
                            <div className={`w-3 h-3 rounded-full border-2 border-white/30 ${
                              commission.clientConfirmed ? 'bg-gradient-to-r from-emerald-400 to-green-500 shadow-green-400/50' : 'bg-gray-400'
                            } shadow-lg`} title={commission.clientConfirmed ? 'Client confirmed' : 'Client pending'}></div>
                          </div>

                          {/* Enhanced View button */}
                          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-pink-500/25 border border-white/20">
                            ✨ View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CommissionListPage;