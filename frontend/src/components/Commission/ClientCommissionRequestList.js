import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Star, 
  Search, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Filter,
  Calendar,
  DollarSign,
  User,
  ImageOff,
  ExternalLink
} from 'lucide-react';

const ClientCommissionRequestList = () => {
  const navigate = useNavigate();
  const { requests } = useOutletContext();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || req.status.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  const getCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'PENDING').length,
      accepted: requests.filter(r => r.status === 'ACCEPTED').length,
      rejected: requests.filter(r => r.status === 'REJECTED').length,
    };
  };

  const counts = getCounts();

  const tabs = [
    { key: 'all', label: 'All', count: counts.all, icon: Filter },
    { key: 'pending', label: 'Pending', count: counts.pending, icon: AlertCircle },
    { key: 'accepted', label: 'Accepted', count: counts.accepted, icon: CheckCircle },
    { key: 'rejected', label: 'Rejected', count: counts.rejected, icon: XCircle },
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-500',
          icon: AlertCircle,
          label: 'Pending'
        };
      case 'ACCEPTED':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-500',
          icon: CheckCircle,
          label: 'Accepted'
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-500',
          icon: XCircle,
          label: 'Rejected'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-500',
          icon: AlertCircle,
          label: 'Unknown'
        };
    }
  };

  const getTabStyles = (tab, isActive) => {
    if (!isActive) {
      return {
        button: 'text-green-700 hover:text-green-800 border-green-600 hover:border-green-700 bg-white',
        badge: 'bg-green-100 text-green-700',
        icon: 'text-green-600'
      };
    }
    return {
      button: 'text-white border-green-600 bg-green-600',
      badge: 'bg-green-800 text-white',
      icon: 'text-white'
    };
  };

  return (
    <div className="w-full h-full bg-green-50">
      {/* Header Section */}
      <div className="bg-white border-b-2 border-green-600 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-green-800 m-0 p-0 leading-tight">My Commission Requests</h1>
            <p className="text-sm text-green-700 flex items-center gap-1 mt-1 m-0 p-0">
              <Filter size={12} />
              <span>{filteredRequests.length} of {requests.length} requests</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={16} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-white border-2 border-green-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-sm"
              />
            </div>
            <button className="p-2 text-green-600 bg-white border-2 border-green-600 rounded-md hover:bg-green-50 transition-colors">
              <Star size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const styles = getTabStyles(tab, isActive);
            const TabIcon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border-2 border-green-600 text-sm font-medium transition-all ${styles.button}`}
              >
                <TabIcon size={14} className={styles.icon} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border border-green-600 ${styles.badge}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 pb-4 overflow-y-auto" style={{maxHeight: 'calc(100vh - 200px)'}}>
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-white border-2 border-green-600 rounded-lg flex items-center justify-center shadow-md">
              <MessageSquare size={24} className="text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-green-800 mb-2 m-0 p-0">No requests found</h3>
            <p className="text-sm text-green-700 m-0 p-0">
              {searchQuery 
                ? `No requests match "${searchQuery}" in ${activeTab === 'all' ? 'all' : activeTab} status`
                : `No ${activeTab === 'all' ? '' : activeTab} requests yet`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request, index) => {
              const statusInfo = getStatusInfo(request.status);
              const StatusIcon = statusInfo.icon;
              const hasImageError = imageErrors[index];
              
              return (
                <div key={index} className="bg-white border-2 border-green-600 rounded-lg shadow-md">
                  {/* Request Header */}
                  <div className="bg-green-100 border-b-2 border-green-600 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-800">
                      <Clock size={14} />
                      <span className="text-sm font-medium m-0 p-0">Created: {request.createdAt}</span>
                    </div>
                    
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border-2 ${statusInfo.border} ${statusInfo.bg}`}>
                      <StatusIcon size={14} className={statusInfo.text} />
                      <span className={`text-sm font-bold m-0 p-0 ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Left Column - Request Details */}
                      <div className="col-span-8 space-y-4">
                        {/* Description Box */}
                        <div className="border-2 border-green-600 rounded-md p-3 bg-green-50">
                          <h4 className="text-sm font-bold text-green-800 mb-2 m-0 p-0 uppercase tracking-wide">DESCRIPTION:</h4>
                          <p className="text-sm text-green-900 leading-relaxed m-0 p-0">{request.description}</p>
                        </div>
                        
                        {/* Info Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {/* Price */}
                          <div className="border-2 border-green-600 rounded-md p-3 bg-green-100 text-center">
                            <DollarSign size={18} className="mx-auto text-green-700 mb-1" />
                            <h5 className="text-xs font-bold text-green-800 mb-1 m-0 p-0 uppercase">PRICE:</h5>
                            <p className="text-base font-bold text-green-900 m-0 p-0">${request.price}</p>
                          </div>
                          
                          {/* Deadline */}
                          <div className="border-2 border-green-600 rounded-md p-3 bg-orange-50 text-center">
                            <Calendar size={18} className="mx-auto text-orange-600 mb-1" />
                            <h5 className="text-xs font-bold text-green-800 mb-1 m-0 p-0 uppercase">DEADLINE:</h5>
                            <p className="text-sm font-bold text-orange-700 m-0 p-0">{request.deadline}</p>
                          </div>
                          
                          {/* Artist */}
                          <div className="border-2 border-green-600 rounded-md p-3 bg-blue-50 text-center">
                            <User size={18} className="mx-auto text-blue-600 mb-1" />
                            <h5 className="text-xs font-bold text-green-800 mb-1 m-0 p-0 uppercase">ARTIST:</h5>
                            <button 
                              onClick={() => navigate(`/user/${request.artistID}`)}
                              className="text-sm font-bold text-blue-700 flex items-center justify-center gap-1 cursor-pointer hover:text-blue-800 transition-colors w-full"
                              title={`@${request.artistname}`}
                            >
                              <span className="truncate m-0 p-0">@{request.artistname}</span>
                              <ExternalLink size={10} />
                            </button>
                          </div>
                        </div>

                        {/* Artist Response */}
                        {request.reply && (
                          <div className="border-2 border-green-600 rounded-md p-3 bg-blue-50">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare size={14} className="text-blue-600" />
                              <h5 className="text-sm font-bold text-green-800 m-0 p-0 uppercase tracking-wide">ARTIST RESPONSE:</h5>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed italic m-0 p-0">"{request.reply}"</p>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Reference Image */}
                      <div className="col-span-4">
                        <div className="border-2 border-green-600 rounded-md p-3 bg-green-50 h-full">
                          <h4 className="text-sm font-bold text-green-800 mb-3 m-0 p-0 uppercase tracking-wide">REFERENCE IMAGE:</h4>
                          <div className="w-full h-40 bg-white border-2 border-green-600 rounded-md overflow-hidden">
                            {hasImageError || !request.refeURL ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-green-500">
                                <ImageOff size={24} className="mb-2" />
                                <span className="text-xs font-medium m-0 p-0">No image available</span>
                              </div>
                            ) : (
                              <img 
                                src={request.refeURL} 
                                alt="Reference"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                onError={() => handleImageError(index)}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientCommissionRequestList;