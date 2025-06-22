import React, { useState } from 'react';
import Sidebar from '../components/AdminDashboard/Sidebar';
import Navbar from '../components/AdminDashboard/Navbar';
import Dashboard from '../components/AdminDashboard/Dashboard';
import ArtistPost from "../components/HomePage/ArtistPost";
import ReportForm from "../components/HomePage/ReportForm";
import "../styles/AdminDashboard.css";
import '../styles/ContentDashboard_P1.css'; 

const Layout = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Widgets':
        return <ReportForm />;
      default:
        return <div>Trang không tồn tại</div>;
    }
  };

  return (
    <div className="layout-container">
      <Sidebar activeItem={activeMenu} onChangeActive={setActiveMenu} />
      <Navbar />
      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default Layout;
