import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import blueflo from "../assets/images/blueflower2.svg"
import NotificationPopup from "../components/Notification/NotificationPopup";
import { 
  Plus, 
  Bell, 
  MoreVertical, 
  Star, 
  Search, 
  Menu, 
  Clock,
  ChevronDown,
  BarChart3,
  Calendar,
  MessageSquare,
  LogOut,
  Users,
  Briefcase,
  Home,
  Link
} from 'lucide-react';

const ClientComDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
     const [compage, setCompage] = useState("clientcomdashboard");
  const [artistava, setArtistava] = useState("");
  const [artistfn, setArtistfn] = useState("");
  
  const [requests, setRequests] = useState([]);
  const [refreshFlag, setRefreshFlag] = useState(false);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/commissions')) return 'Commission';
    if (path.includes('/request')) return 'Request';
    if (path.includes('/schedule')) return 'Schedule';
    if (path.includes('/messages')) return 'Messages';
    if (path.includes('/analysis')) return 'Analysis';
    return 'Request'; // default
  };

  const activeTab = getActiveTab();

  // Menu items pour sidebar
  const sideMenuItems = [
    { id: 'Dashboard', label: 'HomePage', icon: Home, path: '/' },
    { id: 'Commission', label: 'Commission', icon: Briefcase, path: '/clientcomdashboard/commissions' },
    { id: 'Request', label: 'Request', icon: Users, path: '/clientcomdashboard/request' },
  ];

  // Functions pour sidebar
  const togglePopup = () => {
    setShowPopup(prev => !prev);
  };

  // Fetch data depuis API
  useEffect(() => {
    fetch('http://localhost:9999/backend/api/clientreqcom', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.response)) {
          setRequests(data.response);
          setArtistava(data.artistAvatar);
          setArtistfn(data.artistUsername);
        }
      })
      .catch(err => console.error('Error:', err));
  }, [refreshFlag]);

  // Function pour refresh data
  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
  };

  // Redirection par défaut vers /request
  useEffect(() => {
    if (location.pathname === '/clientcomdashboard' || location.pathname === '/clientcomdashboard/') {
      navigate('/clientcomdashboard/request', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Render placeholder pour routes non implementées
  const renderPlaceholder = (title, subtitle) => (
    <div className="flex-1 bg-gradient-to-br from-emerald-50/30 to-teal-50/50 backdrop-blur-sm rounded-tl-3xl p-8">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/30 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 min-h-screen" style={{height: '100%'}}>
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-emerald-900 via-teal-800 to-green-900 p-6 flex flex-col shadow-2xl" style={{height: '100%', width: '16rem'}}>
        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
            <img src={blueflo} className="w-12 h-12" alt="Logo" />
          </div>
          <div className="text-sm font-bold">
            <span className="text-white">Client</span>
            <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">Hub</span>
            <br />
            <span className="text-emerald-200 text-xs">Commission Portal</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {sideMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg transform scale-105 border border-emerald-400/30'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white hover:transform hover:scale-102 hover:bg-gradient-to-r hover:from-emerald-700/50 hover:to-teal-700/50'
                }`}
                onClick={() => {
                  navigate(item.path);
                }}
              >
                <IconComponent size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-emerald-700/50"   onClick={() => navigate("/editprofile")}>
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-800/50 to-teal-800/50 rounded-xl backdrop-blur-sm border border-emerald-600/30">
            <div className="relative">
              <img 
                src={artistava}
                alt="Profile" 
                className="w-10 h-10 rounded-xl ring-2 ring-emerald-400/50 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-emerald-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{artistfn}</div>
              <div className="text-xs text-emerald-200">Client Account</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/30 px-6 py-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">My Commissions</h1>
              <div className="w-px h-6 bg-gradient-to-b from-emerald-300 to-teal-300"></div>
              
              {activeTab === 'Request' && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 shadow-md backdrop-blur-sm">
                  <div className="w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-amber-700 text-sm font-semibold">{requests.length}</span>
                  <span className="text-amber-600 text-sm font-medium">Pending Requests</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={togglePopup}
                className="w-12 h-12 bg-gradient-to-br from-white/90 to-gray-50/90 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/50"
              >
                <Bell size={20} className="text-emerald-600" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* Outlet pour les routes imbriquées */}
        <Outlet context={{ requests, refreshFlag, triggerRefresh, compage }} />
      </div>

      {/* Notification Popup */}
      {showPopup && (
        <div className="absolute top-20 right-6 z-[9999]">
          <NotificationPopup />
        </div>
      )}
    </div>
  );
};

export default ClientComDashboard;