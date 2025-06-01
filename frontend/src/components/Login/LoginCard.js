import React from "react";
import { useState,useEffect } from "react";
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
    document.body.style.display = "flex";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";
    document.body.style.minHeight = "100vh";
    document.body.style.background = "#5F41E4";

    return () => {
      document.body.removeAttribute("style");
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:9999/backend/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      if (!res.ok) {
        const errorText = await res.text();
        setMessage(`API Error: ${res.status} - ${errorText}`);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setMessage("Login success");
        navigate("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage(`Network error: ${error.message}`);
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
        <a href="#!" className="forgot-pass-link">
          Forgot password?
        </a>
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
