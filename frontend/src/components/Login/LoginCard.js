import React, { useState, useEffect } from "react";
import "../../styles/login.css";
import SocialLogin from "./SocialLogin.js";
import InputField from "./InputField";
import { useNavigate, Link } from "react-router-dom";
import { useWebSocket } from "../../contexts/WebSocketContext";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { checkAuthentication } = useWebSocket();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:9999/backend/api/session/check", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        // if (data.loggedIn) {
        //   navigate("/");
        // }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkLogin();

    const root = document.getElementById("root");
    if (root) {
      root.classList.add("log-root");
    }
    return () => {
      if (root) {
        root.classList.remove("log-root");
      }
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:9999/backend/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error: ${res.status} - ${errorText}`);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Login success");

        // Trigger WebSocket connection after successful login
        await checkAuthentication();

        const role = data.user.role?.toUpperCase();

        if (role === "ADMIN") {
          navigate("/471408451d6070899bba1548031a2cf3/admin");
        } else {
          navigate("/");
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-card">
      <h2 className="form-title">Log in with</h2>
      {message && <p className="message">{message}</p>}

      <SocialLogin />

      <p className="separator">
        <span>or</span>
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        <InputField
          type="email"
          placeholder="Email address"
          icon="mail"
          id="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="Password"
          icon="lock"
          id="pw-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link to="/passforget" className="forgot-pass-link">
          Forgot password?
        </Link>
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>

      <p className="signup-text">
        Don't have an account? <Link to="/register">Sign up</Link>
      </p>
    </div>
  );
}
