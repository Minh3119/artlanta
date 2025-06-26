import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TemplatePage() {
  const [currentID, setCurrentID] = useState(0);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetch("http://localhost:9999/backend/api/user/userid", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentID(data.response.userID);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:9999/backend/api/events', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Set events from backend response
      setEvents(data.events);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

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

      <ToastContainer />
    </div>
  );
}
