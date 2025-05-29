import React from "react";
import { useState } from "react";
import "../../styles/styles.css";
import SocialLogin from "./SocialLogin.js";
import InputField from "./InputField";
import { useNavigate } from "react-router-dom";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/backend/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log("Sending:", { email, password });

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
        Don't have an account? <a href="#!">Sign up</a>
      </p>
      {message && <p className="message">{message}</p>}
    </div>
  );
}