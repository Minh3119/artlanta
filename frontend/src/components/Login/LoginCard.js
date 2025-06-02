import React from "react";
import { useState, useEffect } from "react";
import "../../styles/login.css";
import SocialLogin from "./SocialLogin.js";
import InputField from "./InputField";
import { useNavigate, Link } from "react-router-dom";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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
        navigate("/");
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

      <SocialLogin></SocialLogin>

      <p className="separator">
        <span>or</span>
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        <InputField
          type="email"
          placeholder="Email address"
          icon="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></InputField>
        <InputField
          type="password"
          placeholder="Password"
          icon="lock"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></InputField>
        <Link to="/passforget" className="forgot-pass-link">Forgot password?</Link>
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
