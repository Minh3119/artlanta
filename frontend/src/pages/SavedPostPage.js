import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SavePost from "../components/HomePage/SavePost";

export default function TemplatePage() {
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const location = useLocation();

  const openCreatePopup = (type) => {
    if (type === 'event') {
      setIsEventOpen(true);
    }
  };

  const closeCreatePopup = () => {
    setIsEventOpen(false);
  };

  const today_formatted = format(new Date(), "MMMM d, yyyy");

  // Placeholder for navigation actions
  const handleNavigation = (path) => {
    // Implement navigation logic here
  };

  return (
    <div className="homepage-container" id="scrollableDiv" style={{ overflow: "auto" }}>
      <Header openCreatePopup={openCreatePopup} />

      <div className="homepage-time">
        <p>{today_formatted}</p>
      </div>

      <div className="homepage-title">
        <div className="tab-buttons">
          <Link to="/saved">
            <button className={`tab-button${location.pathname === "/saved" ? " active" : ""}`}>
              Saved
            </button>
          </Link>
          <Link to="/homepage">
            <button className={`tab-button${location.pathname === "/homepage" ? " active" : ""}`}>
              Artwork Posts
            </button>
          </Link>
          <Link to="/event">
            <button className={`tab-button${location.pathname === "/event" ? " active" : ""}`}>
              Events
            </button>
          </Link>
        </div>
      </div>

      {/* Add your page content here */}
      <SavePost />
      <ToastContainer />
    </div>
  );
}
