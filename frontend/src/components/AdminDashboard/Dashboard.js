import React, { PureComponent } from 'react';
import { useEffect, useState, useRef, useMemo } from "react";
import {  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AddStaffForm from './AddStaff';
import reload from '../../assets/images/reload.svg';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [users, setUsers] = useState({raw: [], chart_data: [], total_user: 0, mostUserCreDay: "",  total_Mod:0, total_BUser:0});
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [searchText, setSearchText] = useState("");
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(null); 

    const filteredUsers = users.raw.filter(user =>
        user.username?.toLowerCase().includes(searchText.toLowerCase())
    );
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
            if (!user.createdAt)
                return;
            const date = user.createdAt.substring(0, 10);
            map[date] = (map[date] || 0) + 1;
        });
        return Object.entries(map)
                .map(([date, count]) => ({date, count}))
                .sort((a, b) => new Date(a.date) - new Date(b.date)); // 👈 Sort theo ngày
    };

    const filteredData = useMemo(() => {
        return users.chart_data.filter((item) => {
            if (fromDate && item.date < fromDate)
                return false;
            if (toDate && item.date > toDate)
                return false;
            return true;
        });
    }, [users.chart_data, fromDate, toDate]);

    const handleToggleStatus = (userId) => {
        fetch("http://localhost:9999/backend/api/admin/statics", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `userId=${userId}`,
            credentials: "include"
        })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        // Gọi lại fetchPosts để cập nhật danh sách người dùng
                        fetchPosts();
                    } else {
                        alert(data.message || "Failed to toggle user status");
                    }
                })
                .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const roleCount = useMemo(() => {
        const count = {};
        users.raw.forEach(user => {
            const role = user.role;
            if (role) {
                count[role] = (count[role] || 0) + 1;
            }
        });
        return count;
    }, [users.raw]);

    const roleData = Object.entries(roleCount).map(([role, value]) => ({
            name: role,
            value,
        }));


   const statusCount = useMemo(() => {
  const count = {};
  users.raw.forEach(user => {
    const status = user.status;
    if (status) {
      count[status] = (count[status] || 0) + 1;
    }
  });
  return count;
}, [users.raw]);

const statusData = Object.entries(statusCount).map(([status, value]) => ({
  name: status,
  value,
}));

if (isAuthorized === null) return <div>Đang kiểm tra quyền truy cập...</div>;
if (isAuthorized === false) return null;

    return (
            <div className="dashboard">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Dashboard v3</h1>
                    <nav className="breadcrumb">
                        <a href="#" className="breadcrumb__link">Home</a>
                        <span className="breadcrumb__separator">/</span>
                        <span className="breadcrumb__current">Dashboard v3</span>
                    </nav>
                </div>
                <div className="dashboard-row">
                    <section className="card visitors">
                        <header className="card__header">
                            <h3>User Statics</h3>
                            <a href="#" className="card__link">View Report</a>
                        </header>
                        <div className="card__content">
                            <div className="stat total">
                                <div className="stat__number">{users.total_user}</div>
                                <div className="stat__label">User Over Time</div>
                            </div>
                            <div className="stat stat--percent">
                                <i className="fas fa-arrow-up"></i>
                                <div>
                                    <strong>12.5%</strong><br />
                                    Since last week
                                </div>
            
                            </div>
                        </div>
            
                        <div className="date-filter">
                            <label>
                                From:{" "}
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    />
                            </label>
                            <label>
                                To:{" "}
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    />
                            </label>
                            <div className="stat stat--percent">
                                <i className="fas fa-arrow-up"></i>
                                <div>
                                    <strong style={{color: '#28A745'}}>{users.mostUserCreDay}</strong><br />
                                    Most Active User Creation Day
                                </div>
            
                            </div>
                        </div>
            
            
                        <div style={{width: "100%", height: 350, marginLeft: '-20px'}}>
                            <ResponsiveContainer>
                                <LineChart data={filteredData}>
                                    <CartesianGrid strokeDasharray="1 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="count" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
            
                    <section className="card products">
                        <header className="card__header">
                            <h3>User List</h3>
            
                            <input
                                type="text"
                                placeholder="Search username..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{paddingLeft: '15px', borderRadius: 6, border: '1px solid #ccc'}}
                                /> <a href="#" className="card__link">View More</a>       
                        </header>
                        <div>
            
            
                            <div style={{maxHeight: '500px', overflowY: 'auto', marginLeft: '30px'}}>
                                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                                    <thead>
                                        <tr>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>UserName</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>UserID</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>Email</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>Role</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers
                        .filter(user => user.role !== 'ADMIN' && user.role !== 'MODERATOR')
                        .map((user, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <img src={user.avatarURL} alt="user" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8}} />
                                                    {user.username}
                                                </div>
                                            </td>
                                            <td>{user.ID}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleStatus(user.ID)}
                                                    style={{
                                                                                        padding: '6px 12px',
                                                                                        borderRadius: 6,
                                                                                        border: 'none',
                                                                                        backgroundColor: user.status === 'ACTIVE' ? '#28a745' : '#dc3545',
                                                color: '#fff',
                                                cursor: 'pointer'
                                            }}
                                                    >
                                                    {user.status === 'ACTIVE' ? 'Ubanned' : 'Banned'}
                                                </button>
                                            </td>
            
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
            
            
                    </section>
                </div>
                <div className="dashboard-row">
                    <section className="card products">
                        <header className="card__header">
                            <h3>Moderator List</h3>
                            <button
                                onClick={() => setShowForm(true)}
                                style={{
                                        padding: '6px 12px',
                                        borderRadius: 6,
                                        border: 'none',
                                        backgroundColor: '#007bff',
                    color: '#fff',
                    cursor: 'pointer'
                }}
                                >
                                Add Moderator
                            </button>
            
                            <a
                                onClick={() => window.location.reload()}
                                style={{
                    borderRadius: 6,
                    border: 'none',
                                    }}
                                >
                                <img src={reload} alt="alt" style={{
                    borderRadius: 6,
                    width: '20px', height: '20px', cursor: "pointer"
                }}/>
                            </a>
            
                            {showForm && (
                                                <div
                                                style={{
                                                                                    position: 'fixed',
                                                                                    top: 0, left: 0, right: 0, bottom: 0,
                                                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center',
                                                                alignItems: 'center',
                                                                zIndex: 1000
                                                            }}
                                                >
                                                <div
                                                    style={{
                                                                                backgroundColor: '#fff',
                                                                                padding: 20,
                                                                                borderRadius: 10,
                                                        width: '400px',
                                                        position: 'relative'
                                                    }}
                                                    >
                                                    <button
                                                        onClick={() => setShowForm(false)}
                                                        style={{
                                                                                    position: 'absolute',
                                                                                    top: 10,
                                                                                    right: 10,
                                                                                    background: 'transparent',
                                                                                    border: 'none',
                                                        fontSize: 18,
                                                        cursor: 'pointer'
                                                    }}
                                                        >
                                                        Back
                                                    </button>
                                                    <AddStaffForm />
                                                </div>
                                            </div>
                        )}
                        </header>
                        <div>
            
            
                            <div style={{minHeight: '500px', maxHeight: '500px', overflowY: 'auto', marginLeft: '30px'}}>
                                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                                    <thead>
                                        <tr>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>UserName</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>UserID</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>Email</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>Role</th>
                                            <th style={{position: 'sticky', top: 0, background: '#fff'}}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers
                        .filter(user => user.role !== 'CLIENT' && user.role !== 'ARTIST' && user.role !== 'ADMIN')
                        .map((user, index) => (
                                        <tr key={index}>
                                            <td>
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <img src={user.avatarURL} alt="user" style={{width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginRight: 8}} />
                                                    {user.username}
                                                </div>
                                            </td>
                                            <td>{user.ID}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleToggleStatus(user.ID)}
                                                    style={{
                                                                                        padding: '6px 12px',
                                                                                        borderRadius: 6,
                                                                                        border: 'none',
                                                                                        backgroundColor: user.status === 'ACTIVE' ? '#28a745' : '#dc3545',
                                                color: '#fff',
                                                cursor: 'pointer'
                                            }}
                                                    >
                                                    {user.status === 'ACTIVE' ? 'ACTIVE' : 'DEACTIVE'}
                                                </button>
                                            </td>
            
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
            
            
                    </section>
            
                    <section className="card metrics">
                        <header className="card__header">
                            <h3>Platform Statistic Basic</h3>
                            <div className="card__actions">
                                <i className="fas fa-download"></i>
                                <i className="fas fa-th-large"></i>
                            </div>
                        </header>
                        <div className="card__content metrics">
                            <div className="metric">
                                <i className="metric__icon up"></i>
                                <div>
                                    <strong>{users.total_user}</strong><br />Total Users
                                </div>
                            </div>
                            <div className="metric">
                                <i className="metric__icon warning"></i>
                                <div>
                                    <strong>{users.total_BUser}</strong><br />Total Banned Users
                                </div>
                            </div>
                            <div className="metric">
                                <i className="metric__icon down"></i>
                                <div>
                                    <strong>{users.total_Mod}</strong><br />Total Moderator
                                </div>
                            </div>
                        </div>
                        <div style={{display:'flex', marginTop:'50px'}}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={roleData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                    >
                                    {roleData.map((entry, index) => (
                                                            <Cell
                                                            key={`cell-${index}`}
                                                            fill={
                                                                ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a28fd0"][
                                                                        index % 5
                                                                                        ]
                                                            }
                                                            />
                            ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={statusData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {statusData.map((entry, index) => (
        <Cell
          key={`status-cell-${index}`}
          fill={["#28a745", "#ffc107", "#dc3545"][index % 3]} // Active - Yellow - Red
        />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
</div>
                    </section>
                </div>
            </div>
            );
}


