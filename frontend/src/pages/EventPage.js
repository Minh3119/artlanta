import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import CreateEventComponent from "../components/Event/CreateEventComponent";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventPage() {
  const [currentID, setCurrentID] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);

  useEffect(() => {
    if (location.state?.success) {
      toast.success(location.state.success);
    }
    if (location.state?.error) {
      toast.error(location.state.error);
    }

    if (location.state) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

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

  const openCreatePopup = (type) => {
    if (type === 'event') {
      setIsEventOpen(true);
      setIsRefresh(true);
    }
  };

  const closeCreatePopup = () => {
    setIsEventOpen(false);
    setIsRefresh(false);
  };

  const today_formatted = format(new Date(), "MMMM d, yyyy");

  return (
    <div className="homepage-container" id="scrollableDiv" style={{ overflow: "auto" }}>
      <Header openCreatePopup={openCreatePopup} />

      <div className="homepage-time">
        <p>{today_formatted}</p>
      </div>
      
      <div className="homepage-title">
        <div className="tab-buttons">
          <Link to="/homepage">
            <button className="tab-button">
              Artwork Posts
            </button>
          </Link>

          <Link to="/event">
            <button className="tab-button active">
              Events
            </button>
          </Link>
        </div>
      </div>

      <div className="events-list">
        <div className="no-posts-message">
          <p>No events found. Create a new event to get started!</p>
        </div>
      </div>

      {isEventOpen && (
        <CreateEventComponent closeEventPopup={closeCreatePopup} />
      )}
      
      <ToastContainer />
    </div>
  );
}
