import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import arlanta from "../../assets/images/arlanta.svg";
import arrowDown from "../../assets/images/arrow-down.svg";

import noti from "../../assets/images/notification.svg";
import chat from "../../assets/images/chat.svg";
import ava from "../../assets/images/avatar.svg";
import NotificationPopup from "../Notification/NotificationPopup";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import '../../styles/Header.scss';
import SearchBarComponent from "./searchBarComponent";

export default function Header({ openCreatePopup }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userID, setUserID] = useState(0);
  const navigate = useNavigate();
  const createMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (createMenuRef.current && !createMenuRef.current.contains(event.target)) {
        setShowCreateMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          ref={createMenuRef}
          onClick={() => setShowCreateMenu(!showCreateMenu)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <p className="header-navbar__title">Create</p>
          <img
            src={arrowDown}
            alt=""
            style={{
              transform: showCreateMenu ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease'
            }}
          />
          {showCreateMenu && (
            <div className="create-menu-dropdown">
              <div className="create-menu-item" onClick={() => {
                if (userID === 0) {
                  navigate("/login");
                  return;
                };
                openCreatePopup('post');
                setShowCreateMenu(false);
              }}>
                Create Post
              </div>
              <div className="create-menu-item" onClick={() => {
                openCreatePopup('event');
                setShowCreateMenu(false);
              }}>
                Create Event
              </div>
            </div>
          )}
        </div>
      </div>

      <SearchBarComponent />


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


        <div className="header-more" ref={userMenuRef}>
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <img
              src={ava}
              alt="ava"
              style={{ width: "2.5vw", height: "", borderRadius: "50%" }}
            />
            <img
              src={arrowDown}
              alt="more"
              style={{
                transform: showUserMenu ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease'
              }}
            />
            {showUserMenu && (
              <div className="user-menu-dropdown">
                {userID != 0 && (
                  <Link to={`/user/${userID}`} className="user-menu-item">
                    Profile
                  </Link>
                )}
                {userID != 0 && (
                  <Link to="/settings" className="user-menu-item">
                    Settings
                  </Link>
                )}
                {userID != 0 && (
                  <Link to="/recent-posts" className="user-menu-item">
                    Recent Posts
                  </Link>
                )}
                {userID !== 0 && (
                  <div className="user-menu-item" onClick={handleLogout}>
                    <FiLogOut style={{ marginRight: '8px' }} />
                    Logout
                  </div>
                )}
                {userID === 0 && (
                  <>
                    <Link to="/login" className="user-menu-item">
                      Sign in
                    </Link>
                    <Link to="/register" className="user-menu-item">
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
