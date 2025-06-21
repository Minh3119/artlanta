import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import arlanta from "../../assets/images/arlanta.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import search from "../../assets/images/search.svg";
import noti from "../../assets/images/notification.svg";
import chat from "../../assets/images/chat.svg";
import ava from "../../assets/images/avatar.svg";
import NotificationPopup from "../Notification/NotificationPopup";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

export default function Header({ openCreatePopup }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userID, setUserID] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(
          "http://localhost:9999/backend/api/session/check",
          {
            credentials: "include",
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        if (data.loggedIn) {
          setUserID(data.userId);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:9999/backend/api/logout", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        navigate("/login");
        console.log(data);
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout request error:", err);
    }
  };

  return (
    <div className="header-container">
      <div className="header-logo">
        <Link to="/">
          <img src={arlanta} alt="Artlanta" />
        </Link>
      </div>
      <div className="header-navbar">
        <Link to="/">
          <div className="header-navbar__container">
            <p className="header-navbar__title">Home</p>
          </div>
        </Link>
        <Link to="#">
          <div className="header-navbar__container active">
            <p className="header-navbar__title">Today</p>
          </div>
        </Link>
        <div
          className="header-navbar__container"
          onClick={openCreatePopup}
          style={{ cursor: "pointer" }}
        >
          <p className="header-navbar__title">Create</p>
          <img src={arrowDown} alt=""></img>
        </div>
      </div>
      <div className="header-search">
        <input
          type="text"
          className="header-text-input"
          placeholder="Seach"
        ></input>
        <img src={search} alt="" className="search-icon"></img>
      </div>
      <div className="header-icons">
        <div
          className="notification-icon-wrapper"
          style={{ position: "relative", display: "inline-block" }}
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          <img src={noti} alt="noti" />
          {showNotifications && (
            <NotificationPopup onClose={() => setShowNotifications(false)} />
          )}
        </div>
        <Link to="/messages">
          <img src={chat} alt="chat"></img>
        </Link>

        <div className="header-more">
          <Link to="/profile">
            <img src={ava} alt="ava"></img>
          </Link>
          <Link to="#">
            <img src={arrowDown} alt="more"></img>
          </Link>
          {userID === 0 && (
            <div style={{ display: "flex" }}>
              <Link to="/login">
                <p style={{ marginBottom: 0 }}>Sign in</p>
              </Link>
              <Link to="/register">
                <p style={{ marginBottom: 0 }}>Sign up</p>
              </Link>
            </div>
          )}
          {userID !== 0 && (
            <button onClick={handleLogout} className="logout-button">
              <FiLogOut style={{ backgroundColor: "green" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
