import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function HeaderDropDown({ userID, dropdownActive, setDropdownActive }) {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
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
        <p>Số dư: 00.000 vnd</p>
      </div>
      <Link to="/payment">
        <div className="header-dropdown__item">Nạp tiền vào tk</div>
      </Link>
      {userID !== 0 && (
        <button onClick={handleLogout} className="logout-button">
          Log out
        </button>
      )}
    </div>
  );
}