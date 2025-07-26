import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  Plus, 
  MoreVertical, 
  Star, 
  Search, 
  Clock
} from 'lucide-react';

const CommissionRequestList = () => {
  const navigate = useNavigate();
  const { requests, refreshFlag, triggerRefresh } = useOutletContext();
  
  const [openRejectForms, setOpenRejectForms] = useState({});
  const [rejectReasons, setRejectReasons] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Filter requests based on search query
  const filteredRequests = requests.filter(req =>
    req.clientname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle status updates
  const handleUpdateStatus = async (requestId, status, reply, price, deadline) => {
    try {
      const response = await fetch("http://localhost:9999/backend/api/handlerequest", {
        credentials: 'include',
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
      alert(result.message);
      triggerRefresh(); // Trigger refresh from parent
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Toggle reject form
  const toggleRejectForm = (id) => {
    setOpenRejectForms((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle reason change
  const handleReasonChange = (id, value) => {
    setRejectReasons((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Confirm rejection
  const handleConfirmReject = (id) => {
    const reason = rejectReasons[id] || "No reason provided";
    handleUpdateStatus(id, "REJECTED", reason);
    setOpenRejectForms((prev) => ({ ...prev, [id]: false }));
    setRejectReasons((prev) => ({ ...prev, [id]: "" }));
  };

  return (
    <>
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
      <div className="flex-1 bg-gradient-to-br from-slate-50/50 to-blue-50/50 backdrop-blur-lg rounded-tl-3xl overflow-auto" style={{marginLeft:"50px"}}>
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
            {filteredRequests.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Requests Found</h3>
                <p className="text-gray-600">
                  {searchQuery ? `No requests match "${searchQuery}"` : "No pending requests at the moment"}
                </p>
              </div>
            ) : (
              filteredRequests.map((request, index) => (
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

                      {/* Budget & Deadline */}
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium mb-1">Budget</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{request.price}VNĐ</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium mb-1">Deadline</span>
                          <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{request.deadline}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-medium mb-1">From</span>
                          <span 
                            className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent cursor-pointer" 
                            onClick={() => navigate(`/user/${request.clientid}`)}
                          >
                            @{request.clientname}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Image */}
                    <div className="w-44 h-36 relative">
                      <img 
                        src={request.refeURL} 
                        alt="Project preview"
                        className="absolute -left-20 top-5 -right-2 -bottom-2 bg-gradient-to-t from-black/10 to-transparent rounded-2xl scale-105" 
                        style={{top: "5px", left: "-200px", height: "200px", width: "200px"}}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => toggleRejectForm(request.requestID)}
                        className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl hover:from-red-100 hover:to-pink-100 transition-all duration-300 border border-red-100 hover:shadow-lg group"
                      >
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
                        onClick={() => handleUpdateStatus(request.requestID, "ACCEPTED", "Thanks for your trust! Excited to collaborate! ", request.price, request.deadline + "T00:00")}                  
                        className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border border-blue-100 hover:shadow-lg group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl">
                          <Plus size={16} className="text-white" />
                        </div>
                        <span className="text-blue-600 text-sm font-bold">Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommissionRequestList;