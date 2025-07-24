import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import arlanta from "../../assets/images/arlanta.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import { useLocation } from "react-router-dom";
import noti from "../../assets/images/notification.svg";
import chat from "../../assets/images/chat.svg";
import ava from "../../assets/images/avatar.svg";
import NotificationPopup from "../Notification/NotificationPopup";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import "../../styles/Header.scss";
import SearchBarComponent from "./searchBarComponent";

export default function Header({ openCreatePopup }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [ava, setAva] = useState("");
  const [userID, setUserID] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const createMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [eKYC, setEKYC] = useState(false);
  const [accURL, setAccURL] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        createMenuRef.current &&
        !createMenuRef.current.contains(event.target)
      ) {
        setShowCreateMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const checkWallet = async () => {
      try {
        const res = await fetch("http://localhost:9999/backend/api/wallet", {
          credentials: "include",
          method: "POST",
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data.balance) {
          setBalance(data.balance);
        }
      } catch (error) {
        console.error("Failed to check wallet:", error);
      }
    };

    checkWallet();
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
          setIsLogin(true);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    const checkEKYC = async () => {
      try {
        const res = await fetch(
          "http://localhost:9999/backend/api/check/eKYC",
          {
            credentials: "include",
            method: "POST"
          }
        );

        if (!res.ok) return;

        const data = await res.json();
        if (data.isKYC) {
          setEKYC(true);
        }
      } catch (error) {
        console.error("Failed to check session:", error);
      }
    };

    checkEKYC();
  }, []);

useEffect(() => {
  const checkRole = async () => {
    try {
      const res = await fetch("http://localhost:9999/backend/api/role/check", {
        credentials: "include",
      });

      if (!res.ok) return;

      const data = await res.json();
      setAva(data.avatarURL);
      if (data.isArtist) {
        setIsArtist(true);
      }
    } catch (error) {
      console.error("Failed to check role:", error);
    }
  };

  checkRole();
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
        {isLogin && !isArtist && location.pathname === "/" && (
          <div className="artist-invitation-container">
            <Link to="/artistPost" className="artist-invitation__link">
              <p>I want to be an Artist!!</p>
            </Link>
          </div>
        )}
        {isLogin && isArtist && !eKYC && location.pathname === "/" && (
          <div className="artist-invitation-container">
            <Link to="/eKYC" className="artist-invitation__link">
              <p>Verify eKYC</p>
            </Link>
          </div>
        )}
      </div>
      <div className="header-navbar">
        <Link to="commissiondashboard/commissions">
          <div className="header-navbar__container">
            <p className="header-navbar__title">Commissions</p>
          </div>
        </Link>
        {
          !userID ?
            <Link to="/login">
              <div className="header-navbar__container active">
                <p className="header-navbar__title">Live</p>
              </div>

            </Link>
            :
            <Link to="/live/form">
              <div className="header-navbar__container active">
                <p className="header-navbar__title">Live</p>
              </div>

            </Link>
        }
        <div
          className="header-navbar__container"
          ref={createMenuRef}
          onClick={() => setShowCreateMenu(!showCreateMenu)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <p className="header-navbar__title" id="test-create-btn">Create</p>
          <img
            src={arrowDown}
            alt=""
            style={{
              transform: showCreateMenu ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
            }}
          />
          {showCreateMenu && (
            <div className="create-menu-dropdown">
              <div
                className="create-menu-item"
                onClick={() => {
                  if (userID === 0) {
                    navigate("/login");
                    return;
                  }
                  openCreatePopup("post");
                  setShowCreateMenu(false);
                }}
              >
                Create Post
              </div>
              <div
                className="create-menu-item"
                onClick={() => {
                  openCreatePopup("event");
                  setShowCreateMenu(false);
                }}
              >
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
                transform: showUserMenu ? "rotate(180deg)" : "none",
                transition: "transform 0.2s ease",
              }}
            />
            {showUserMenu && (
              <div className="user-menu-dropdown">
       {isArtist && userID != 0 && (
                  <Link to="/commissiondashboard" className="user-menu-item"  style={{
        background: `radial-gradient(ellipse 98.08% 114.73% at -3.98% 12.50%, #5EDCFF 0%, rgba(94, 220, 255, 0) 100%), 
             radial-gradient(ellipse 136.08% 98.99% at 43.75% 114.06%, #3D8BFF 0%, #A8E8FF 81%), 
             #0F4C81`,
            
        boxShadow: '0px 0px 10px rgba(255, 255, 255, 0.80) inset',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        marginTop:'-8px',
        cursor: 'pointer',
        textShadow: '0 0 5px white'
      }}>
                    Manage Commission
                  </Link>
                )}
                {userID != 0 && (
                  <Link to="/" className="user-menu-item">
                    Balance: {Math.floor(balance).toLocaleString()} VND
                  </Link>
                )}
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
                {userID != 0 && (
                  <Link to="/payment" className="user-menu-item">
                    Top Up
                  </Link>
                )}
                {userID != 0 && isArtist && (
                  <Link to="/withdraw" className="user-menu-item">
                    Withdraw
                  </Link>
                )}
                {userID != 0 && (
                  <Link to="/paymentHis" className="user-menu-item">
                    Transaction History
                  </Link>
                )}
                {userID !== 0 && (
                  <div className="user-menu-item" onClick={handleLogout}>
                    <FiLogOut style={{ marginRight: "8px" }} />
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
