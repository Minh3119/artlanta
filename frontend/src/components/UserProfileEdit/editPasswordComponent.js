import React, { useState } from "react";
import { Link } from "react-router-dom";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const EditPasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!oldPassword) {
      setMessage("Please enter your old password.");
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9999/backend/api/changepassword", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Password changed successfully.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message || "Failed to change password.");
      }
    } catch (err) {
      setMessage("Network error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="edit-password-outer-container">
      <form onSubmit={handleSubmit} className="edit-password-mockup-box">
        <div className="form-group">
          <input
            type="password"
            id="oldPassword"
            placeholder="Old Password"
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            required
            disabled={loading}
            className="edit-password-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="newPassword"
            placeholder="New Password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            disabled={loading}
            className="edit-password-input"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="edit-password-input"
          />
        </div>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Link to="/passforget" className="edit-password-forgot-link">
            Forgot your password?
          </Link>
        </div>
        {message && <div style={{ color: message.includes("success") ? "green" : "red", marginBottom: 10, textAlign: "center" }}>{message}</div>}
      </form>
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button type="submit" form="" className="edit-password-btn" disabled={loading} onClick={handleSubmit}>
          Change Password
        </button>
      </div>
    </div>
  );
};

export default EditPasswordComponent;