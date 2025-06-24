import React, { useState,useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../contexts/WebSocketContext";

export default function HeaderDropDown({ userID, dropdownActive, setDropdownActive }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [balance, setBalance] = useState(0);
  const { ws } = useWebSocket();

  const handleLogout = async () => {
    try {
      // Close WebSocket connection first
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }

      const res = await fetch("http://localhost:9999/backend/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/login");
      } else {
        console.error("Logout failed:", data.message);
      }
    } catch (err) {
      console.error("Logout request error:", err);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (userID && userID !== 0) {
        try {
          const res = await fetch("http://localhost:9999/backend/api/wallet", {
            method: "POST",
            credentials: "include",
          });
          const data = await res.json();
          if (data.balance) {
            setBalance(parseInt(data.balance));
          } else {
            setBalance(0);
          }
        } catch (err) {
          console.error("Failed to fetch wallet:", err);
          setBalance(0);
        }
      } else {
        setBalance(0);
      }
    };

    fetchBalance();
  }, [userID]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setDropdownActive]);

  return (
    <div
      ref={dropdownRef}
      className={`header-drowdown__container ${dropdownActive ? "active" : ""}`}
    >
      <div className="header-dropdown__item">
        <p>Số dư: {balance} vnd</p>
      </div>
      <Link to="/payment">
        <div className="header-dropdown__item">Nạp tiền vào tk</div>
      </Link>
      <Link to = "/paymentHis">
        <div className="header-dropdown__item">Lịch sử giao dịch</div>
      </Link>
      {userID !== 0 && (
        <button onClick={handleLogout} className="logout-button">
          Log out
        </button>
      )}
    </div>
  );
}