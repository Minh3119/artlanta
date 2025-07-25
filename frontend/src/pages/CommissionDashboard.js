import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import blueflo from "../assets/images/blueflower.svg"
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

const CommissionDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  
  const [artistava, setArtistava] = useState("");
  const [artistfn, setArtistfn] = useState("");
    const [compage, setCompage] = useState("commissiondashboard");
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
    { id: 'Commission', label: 'Commission', icon: Briefcase, path: '/commissiondashboard/commissions' },
    { id: 'Request', label: 'Request', icon: Users, path: '/commissiondashboard/request' },
    { id: 'Schedule', label: 'Schedule', icon: Calendar, path: '/commissiondashboard/schedule' },
    { id: 'Messages', label: 'Messages', icon: MessageSquare, path: '/commissiondashboard/messages' },
    { id: 'Analysis', label: 'Analysis', icon: BarChart3, path: '/commissiondashboard/analysis' },
    { id: 'LogOut', label: 'Log out', icon: LogOut, path: '/logout' }
  ];

  // Functions pour sidebar
  const togglePopup = () => {
    setShowPopup(prev => !prev);
  };

  // Fetch data depuis API
  useEffect(() => {
    fetch('http://localhost:9999/backend/api/reqcom', {
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
    if (location.pathname === '/commissiondashboard' || location.pathname === '/commissiondashboard/') {
      navigate('/commissiondashboard/request', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Render placeholder pour routes non implementées
  const renderPlaceholder = (title, subtitle) => (
    <div className="flex-1 bg-gradient-to-br from-slate-50/50 to-blue-50/50 backdrop-blur-lg rounded-tl-3xl p-8">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen" style={{height: '100%'}}>
      {/* Sidebar */}
      <div className="w-52 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 p-6 flex flex-col shadow-2xl" style={{height: '100%', width: '14rem'}}>
        <div className="flex items-center gap-4 mb-10">
          <img src={blueflo} className="w-10 h-10 rounded-full shadow-lg" alt="Logo" />
          <div className="text-sm font-bold">
            <span className="text-white">W</span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">o</span>
            <span className="text-white">rkhubs</span>
            <br />
            <span className="text-slate-300">Artlanta</span>
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
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white hover:transform hover:scale-102'
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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Com!!</h1>
              <div className="w-px h-6 bg-gradient-to-b from-blue-200 to-indigo-200"></div>
              
              {activeTab === 'Request' && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <span className="text-blue-600 text-sm font-bold">{requests.length}</span>
                  <span className="text-slate-600 text-sm font-medium">Pending Request</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={togglePopup}
                className="w-10 h-10 bg-white/80 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Bell size={18} className="text-slate-700" />
              </button>
            </div>

            <div className="flex items-center gap-3 px-3 py-2 bg-white/80 backdrop-blur-lg rounded-xl shadow-md">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-700">{artistfn}</div>
                <div className="text-xs text-slate-500">My settings</div>
              </div>
              <div className="relative">
                <img 
                  src={artistava}
                  alt="Profile" 
                  className="w-10 h-10 rounded-xl ring-2 ring-gradient-to-r from-blue-400 to-cyan-400"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              <button 
                className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center hover:bg-white/80 transition-all duration-300" 
                onClick={() => navigate("/editprofile")}
              >
                <MoreVertical size={16} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Outlet pour les routes imbriquées */}
        <Outlet context={{ requests, refreshFlag, triggerRefresh, compage }} />
      </div>

      {/* Notification Popup */}
      {showPopup && (
        <div className="absolute top-12 right-20 z-[9999]">
          <NotificationPopup />
        </div>
      )}
    </div>
  );
};

export default CommissionDashboard;