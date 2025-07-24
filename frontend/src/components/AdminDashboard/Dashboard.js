import React, { useState, useMemo, useEffect } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart, Area, AreaChart } from 'recharts';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [users, setUsers] = useState({raw: [], chart_data: [], total_user: 0, mostUserCreDay: "", total_Mod: 0, total_BUser: 0});
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [banUsername, setBanUsername] = useState("");
    const [showBanForm, setShowBanForm] = useState(false);
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(null);

    const fetchPosts = () => {
        fetch("http://localhost:9999/backend/api/admin/statics", {
            credentials: "include",
        })
        .then((res) => res.json())
        .then((data) => {
            const grouped = groupUsersByDate(data.response);
            setUsers({
                raw: data.response,
                chart_data: grouped,
                total_user: data.total_user,
                mostUserCreDay: data.mostUserCreDay,
                total_Mod: data.total_Mod,
                total_BUser: data.total_BUser
            });
            setIsAuthorized(true);
        })
        .catch((err) => {
            console.error("Fetch failed:", err);
            setIsAuthorized(false);
            navigate("/home");
        });
    };

    const groupUsersByDate = (data) => {
        const map = {};
        data.forEach((user) => {
            if (!user.createdAt) return;
            const date = user.createdAt.substring(0, 10);
            map[date] = (map[date] || 0) + 1;
        });
        return Object.entries(map)
            .map(([date, count]) => ({date, count}))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const filteredData = useMemo(() => {
        return users.chart_data.filter((item) => {
            if (fromDate && item.date < fromDate) return false;
            if (toDate && item.date > toDate) return false;
            return true;
        });
    }, [users.chart_data, fromDate, toDate]);

    // Calculate meaningful metrics
    const metrics = useMemo(() => {
        const totalUsers = users.total_user;
        const bannedUsers = users.total_BUser;
        const moderators = users.total_Mod;
        const activeUsers = totalUsers - bannedUsers;
        
        // User Growth Rate (last 7 days vs previous 7 days)
        const last7Days = users.chart_data.slice(-7);
        const prev7Days = users.chart_data.slice(-14, -7);
        const last7Total = last7Days.reduce((sum, day) => sum + day.count, 0);
        const prev7Total = prev7Days.reduce((sum, day) => sum + day.count, 0);
        const growthRate = prev7Total > 0 ? (((last7Total - prev7Total) / prev7Total) * 100).toFixed(1) : "0";
        
        // Ban Rate
        const banRate = totalUsers > 0 ? ((bannedUsers / totalUsers) * 100).toFixed(1) : "0";
        
        // User Engagement Score (public profiles ratio)
        const privateUsers = users.raw.filter(u => u.isPrivate).length;
        const engagementScore = totalUsers > 0 ? (((totalUsers - privateUsers) / totalUsers) * 100).toFixed(1) : "0";
        
        // Moderation Ratio
        const moderationRatio = moderators > 0 ? (totalUsers / moderators).toFixed(1) : "∞";
        
        return {
            totalUsers,
            activeUsers,
            bannedUsers,
            moderators,
            growthRate,
            banRate,
            engagementScore,
            moderationRatio
        };
    }, [users]);

    // Enhanced chart data with active/banned breakdown
    const enhancedChartData = useMemo(() => {
        return filteredData.map(item => {
            // Calculate cumulative users up to this date
            const dateIndex = users.chart_data.findIndex(d => d.date === item.date);
            const cumulativeUsers = users.chart_data.slice(0, dateIndex + 1).reduce((sum, d) => sum + d.count, 0);
            const estimatedActive = Math.floor(cumulativeUsers * (1 - users.total_BUser / users.total_user));
            const estimatedBanned = cumulativeUsers - estimatedActive;
            
            return {
                ...item,
                cumulativeUsers,
                activeUsers: estimatedActive,
                bannedUsers: estimatedBanned
            };
        });
    }, [filteredData, users]);

    // Role distribution
    const roleDistribution = useMemo(() => {
        const roleCount = {};
        users.raw.forEach(user => {
            roleCount[user.role] = (roleCount[user.role] || 0) + 1;
        });
        
        return Object.entries(roleCount).map(([role, count]) => ({
            name: role,
            value: count,
            percentage: users.raw.length > 0 ? ((count / users.raw.length) * 100).toFixed(1) : "0"
        }));
    }, [users.raw]);

    // User activity trends (mock weekly data based on real data)
    const activityTrends = useMemo(() => {
        const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const baseEngagement = parseFloat(metrics.engagementScore) || 60;
        
        return weeks.map((week, index) => ({
            week,
            activeRate: Math.max(0, baseEngagement + (Math.random() * 20) - 10),
            engagementRate: Math.max(0, baseEngagement - 10 + (Math.random() * 15)),
            retentionRate: Math.max(0, 85 - (index * 3) + (Math.random() * 10))
        }));
    }, [metrics.engagementScore]);

    const handleBanUser = () => {
        if (!banUsername.trim()) {
            alert('Vui lòng nhập username');
            return;
        }
        
        // Find user by username
        const user = users.raw.find(u => u.username.toLowerCase() === banUsername.toLowerCase());
        if (!user) {
            alert('Không tìm thấy user với username này');
            return;
        }
        
        // Call ban API
        fetch("http://localhost:9999/backend/api/admin/statics", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `userId=${user.ID}`,
            credentials: "include"
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                alert(`Đã ${user.status === 'ACTIVE' ? 'ban' : 'unban'} user: ${banUsername}`);
                setBanUsername("");
                setShowBanForm(false);
                fetchPosts(); // Refresh data
            } else {
                alert(data.message || "Failed to toggle user status");
            }
        })
        .catch((err) => {
            console.error(err);
            alert('Có lỗi xảy ra khi ban user');
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang kiểm tra quyền truy cập...</p>
                </div>
            </div>
        );
    }
    
    if (isAuthorized === false) return null;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 ml-20">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Advanced Analytics Dashboard
                </h1>
                <nav className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="hover:text-blue-600 cursor-pointer">Home</span>
                    <span>/</span>
                    <span className="text-blue-600 font-medium">Analytics Dashboard</span>
                </nav>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Active Users</h3>
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.activeUsers}</div>
                    <div className={`text-sm flex items-center ${parseFloat(metrics.growthRate) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <svg className={`w-4 h-4 mr-1 ${parseFloat(metrics.growthRate) >= 0 ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        {metrics.growthRate}% vs last week
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Platform Health</h3>
                        <div className="bg-green-100 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                        {(100 - parseFloat(metrics.banRate)).toFixed(1)}%
                    </div>
                    <div className="text-sm text-red-500">
                        Ban rate: {metrics.banRate}%
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">User Engagement</h3>
                        <div className="bg-yellow-100 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.engagementScore}%</div>
                    <div className="text-sm text-gray-500">Public profile rate</div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-500">Moderation Load</h3>
                        <div className="bg-purple-100 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{metrics.moderationRatio}:1</div>
                    <div className="text-sm text-gray-500">Users per moderator</div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">
                            User Growth & Activity Trends
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={350}>
                        <ComposedChart data={enhancedChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{fontSize: 12}} />
                            <YAxis yAxisId="left" tick={{fontSize: 12}} />
                            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="cumulativeUsers" fill="#3b82f6" stroke="#3b82f6" fillOpacity={0.3} name="Total Users" />
                            <Line yAxisId="left" type="monotone" dataKey="activeUsers" stroke="#10b981" strokeWidth={3} name="Active Users" />
                            <Bar yAxisId="right" dataKey="count" fill="#f59e0b" name="New Users" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">User Role Distribution</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={roleDistribution}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                                labelLine={false}
                            >
                                {roleDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">User Engagement Metrics</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={activityTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="week" tick={{fontSize: 12}} />
                            <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                            <Tooltip 
                                formatter={(value) => [`${value.toFixed(1)}%`]}
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Legend />
                            <Area type="monotone" dataKey="activeRate" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Active Rate" />
                            <Area type="monotone" dataKey="engagementRate" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Engagement Rate" />
                            <Area type="monotone" dataKey="retentionRate" stackId="3" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} name="Retention Rate" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Quick Ban User</h3>
                        <button
                            onClick={() => setShowBanForm(!showBanForm)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                showBanForm 
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                                    : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                        >
                            {showBanForm ? 'Cancel' : 'Ban User'}
                        </button>
                    </div>

                    {showBanForm && (
                        <div className="mb-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username to Ban:
                                </label>
                                <input
                                    type="text"
                                    value={banUsername}
                                    onChange={(e) => setBanUsername(e.target.value)}
                                    placeholder="Enter username..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleBanUser}
                                className="w-full bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Confirm Ban/Unban
                            </button>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Platform Insights</h4>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <strong className="text-blue-900">Peak Activity Day</strong>
                            </div>
                            <p className="text-blue-800">{users.mostUserCreDay}</p>
                        </div>

                        <div className={`p-4 rounded-lg border ${
                            parseFloat(metrics.banRate) < 15 
                                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                                : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200'
                        }`}>
                            <div className="flex items-center mb-2">
                                <svg className={`w-5 h-5 mr-2 ${parseFloat(metrics.banRate) < 15 ? 'text-green-600' : 'text-yellow-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <strong className={parseFloat(metrics.banRate) < 15 ? 'text-green-900' : 'text-yellow-900'}>
                                    Platform Status
                                </strong>
                            </div>
                            <p className={parseFloat(metrics.banRate) < 15 ? 'text-green-800' : 'text-yellow-800'}>
                                {parseFloat(metrics.banRate) < 15 ? 'Healthy' : 'Needs Attention'}
                            </p>
                        </div>

                        <div className={`p-4 rounded-lg border ${
                            parseFloat(metrics.moderationRatio) < 10 
                                ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                                : 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200'
                        }`}>
                            <div className="flex items-center mb-2">
                                <svg className={`w-5 h-5 mr-2 ${parseFloat(metrics.moderationRatio) < 10 ? 'text-green-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <strong className={parseFloat(metrics.moderationRatio) < 10 ? 'text-green-900' : 'text-orange-900'}>
                                    Moderation Efficiency
                                </strong>
                            </div>
                            <p className={parseFloat(metrics.moderationRatio) < 10 ? 'text-green-800' : 'text-orange-800'}>
                                {parseFloat(metrics.moderationRatio) < 10 ? 'Optimal' : 'Consider more moderators'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}