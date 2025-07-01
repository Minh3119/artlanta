import React, { useState } from 'react';
import Sidebar from '../components/AdminDashboard/Sidebar';
import Navbar from '../components/AdminDashboard/Navbar';
import Dashboard from '../components/AdminDashboard/Dashboard';
import ArtistPost from "../components/HomePage/ArtistPost";
import ReportForm from "../components/HomePage/ReportForm";
import JsonHero from "../components/AdminDashboard/JsonHero";
import PaymentStats from "../components/AdminDashboard/PaymentStats";
import "../styles/AdminDashboard.css";
import '../styles/ContentDashboard_P1.css'; 

const Layout = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Data Reader Widgets':
        return <JsonHero />;
        case 'Payment':
        return <PaymentStats />;
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
