import React, { useEffect, useState } from 'react';
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
  import { useNavigate } from 'react-router-dom'; 
const CommissionDashboard = () => {
  const [requests, setRequests] = useState([]);
 const [activeTab, setActiveTab] = useState('Request');
const navigate = useNavigate();
const [openRejectForms, setOpenRejectForms] = useState({});
const [artistava, setArtistava] = useState("");
const [artistfn, setArtistfn] = useState("");
const [rejectReasons, setRejectReasons] = useState({});
const [refreshFlag, setRefreshFlag] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const [showPopup, setShowPopup] = useState(false);

// thêm path vào mỗi item
const sideMenuItems = [
  { id: 'Dashboard', label: 'HomePage', icon: Home, path: '/' },
  { id: 'Commission', label: 'Commission', icon: Briefcase, path: '/commissions' },
  { id: 'Request', label: 'Request', icon: Users, path: '/commissiondashboard/request' },
  { id: 'Schedule', label: 'Schedule', icon: Calendar, path: '/schedule' },
  
  { id: 'Messages', label: 'Messages', icon: MessageSquare, path: '/messages' },
  { id: 'Analysis', label: 'Analysis', icon: BarChart3, path: '/analysis' },
  { id: 'LogOut', label: 'Log out', icon: LogOut, path: '/logout' }
];
const filteredRequests = requests.filter(req =>
  req.clientname.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleUpdateStatus = async (requestId, status, reply, price, deadline) => {
  try {
    const response = await fetch("http://localhost:9999/backend/api/handlerequest", {
         credentials: 'include' ,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        requestId: requestId,
        status: status,
        reply: reply,
        price: price,
        deadline: deadline,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update status");
    }

    const result = await response.json();
    alert(result.message); // thêm dòng này để hiển thị message
    setRefreshFlag((prev) => !prev);
  } catch (error) {
    console.error("Error:", error);
  }
};

 const togglePopup = () => {
    setShowPopup(prev => !prev);
  };
    
   useEffect(() => {
  fetch('http://localhost:9999/backend/api/reqcom', {
    credentials: 'include' // gửi cookie kèm request
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


const toggleRejectForm = (id) => {
  setOpenRejectForms((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

const handleReasonChange = (id, value) => {
  setRejectReasons((prev) => ({
    ...prev,
    [id]: value,
  }));
};

const handleConfirmReject = (id) => {
  const reason = rejectReasons[id] || "No reason provided";
  handleUpdateStatus(id, "REJECTED", reason);
  setOpenRejectForms((prev) => ({ ...prev, [id]: false }));
  setRejectReasons((prev) => ({ ...prev, [id]: "" }));
};


  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen" style={{height: '100%'}}>
      {/* Sidebar */}
      <div className="w-52 bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900 p-6 flex flex-col shadow-2xl " style={{height: '100rem', width: '14rem'}}>
        <div className="flex items-center gap-4 mb-10">
          <img src={blueflo} className="w-10 h-10 rounded-full shadow-lg"></img>
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
        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
              item.active
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg transform scale-105'
                : 'text-slate-300 hover:bg-white/10 hover:text-white hover:transform hover:scale-102'
            }`}
            onClick={() => {
              setActiveTab(item.id);
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
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 px-6 py-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Com!!</h1>
              <div className="w-px h-6 bg-gradient-to-b from-blue-200 to-indigo-200"></div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                <span className="text-blue-600 text-sm font-bold">{requests.length}</span>
                <span className="text-slate-600 text-sm font-medium">Pending  Request</span>
              </div>
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
              <button className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center hover:bg-white/80 transition-all duration-300" onClick={() => navigate("/settings/editprofile")}>
                <MoreVertical size={16} className="text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub Header */}
        <div className="bg-white/60 backdrop-blur-lg border-b border-white/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Commission Request</h2>
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-slate-200 to-slate-300"></div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Star size={16} className="text-white" />
            </button>
            <div className="relative">
  <input
    type="text"
    placeholder="Search by client name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10 pr-4 py-2 w-64 bg-white/80 backdrop-blur-lg rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
  />
  <div className="absolute left-3 top-2 text-slate-600">
    <Search size={20} />
  </div>
</div>

          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-gradient-to-br from-slate-50/50 to-blue-50/50 backdrop-blur-lg rounded-tl-3xl" style={{marginLeft:"50px"}}>
          <div className="p-8">
            {/* Pending Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between w-60 mb-6">
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">Pending Requests</h3>
                <button className="w-8 h-8 bg-white/60 rounded-lg flex items-center justify-center hover:bg-white/80 transition-all duration-300">
                  <MoreVertical size={16} className="text-slate-600" />
                </button>
              </div>
            </div>

            {/* Commission Cards */}
            <div className="space-y-8">
              {filteredRequests.map((request, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 hover:transform hover:scale-[1.02]">
                  <div className="flex items-start gap-8">
                    {/* Content */}
                    <div className="flex-1">
                      {/* Date */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-100 to-blue-50 rounded-xl flex items-center justify-center shadow-sm">
                          <Clock size={16} className="text-slate-500" />
                        </div>
                        <span className="text-sm text-slate-500 font-medium">{request.createdAt}</span>
                      </div>

                      {/* Title */}
                      <h4 className="text-lg font-semibold text-slate-800 mb-4 leading-relaxed">{request.description}</h4>

                      {/* Tags */}


                      {/* Budget & Deadline */}
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium mb-1">Budget</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{request.price}$</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium mb-1">Deadline</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{request.deadline}</span>
                        </div>
                         <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium mb-1">From</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent cursor-pointer" onClick={() => navigate(`/user/${request.clientid}`)}>@{request.clientname}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="w-44 h-36 relative">
                      <img 
                        src={request.refeURL} 
                        alt="Project preview"
                        className="absolute -left-20 top-5 -right-2 -bottom-2 bg-gradient-to-t from-black/10 to-transparent rounded-2xl scale-105" 
                        style={{top: "5px",  left: "-200px", height: "200px", width: "200px" }}
                      />
                   

                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <button
  onClick={() => toggleRejectForm(request.requestID)}
  className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl hover:from-red-100 hover:to-pink-100 transition-all duration-300 border border-red-100 hover:shadow-lg group">
  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl">
    <div className="w-4 h-0.5 bg-white rounded-full"></div>
  </div>
  <span className="text-red-600 text-sm font-bold">Reject</span>
</button>

{openRejectForms[request.requestID] && (
  <div className="mt-4 p-4 bg-white rounded-xl shadow-md border border-red-100 space-y-2">
    <textarea
      value={rejectReasons[request.requestID] || ""}
      onChange={(e) => handleReasonChange(request.requestID, e.target.value)}
      placeholder="Enter reason for rejection..."
      className="w-full p-2 border border-slate-200 rounded-lg text-sm"
    />
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setOpenRejectForms(prev => ({ ...prev, [request.requestID]: false }))}
        className="text-sm px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-slate-700"
      >
        Cancel
      </button>
      <button
        onClick={() => handleConfirmReject(request.requestID)}
        className="text-sm px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
      >
        Confirm Reject
      </button>
    </div>
  </div>
)}

                      
                      <button 
    onClick={() => handleUpdateStatus(request.requestID, "ACCEPTED", "Thanks for your trust! Excited to collaborate! ",request.price,request.deadline+ "T00:00")}                  
    className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border border-blue-100 hover:shadow-lg group">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl">
                          <Plus size={16} className="text-white" />
                        </div>
                        <span className="text-blue-600 text-sm font-bold">Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
          <div className="absolute top-12 right-20 z-[9999]">
          <NotificationPopup />
        </div>
      )}
    </div>
  );
};

export default CommissionDashboard;