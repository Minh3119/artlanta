import InputField from ".././Login/InputField.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterCard() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
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

  const handleRegister = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage(
        "Password phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      return;
    }

    if (password !== cpassword) {
      setMessage("Password phải trùng với Confirm password");
      setCPassword("");
      return;
    }

    try {
      const res = await fetch("http://localhost:9999/backend/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data.message || `API Error: ${res.status}`);
        console.error(data.message || `API Error: ${res.status}`);
        return;
      }

      setMessage("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => {
        navigate("/login");
      });
    } catch (error) {
      setMessage(`Network error`);
      console.error("Register error:", error);
    }
  };

  return (
    <div className="login-card">
      <h2 className="form-title">Sign up</h2>
      {message && (
        <p className="message" style={{ color: "red" }}>
          {message}
        </p>
      )}
      <form className="login-form" onSubmit={handleRegister}>
        <InputField
          type="email"
          placeholder="Email address"
          icon="mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></InputField>
        <InputField
          type="text"
          placeholder="Username"
          icon="view_timeline"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        <InputField
          type="password"
          placeholder="Confirm password"
          icon="lock"
          value={cpassword}
          onChange={(e) => setCPassword(e.target.value)}
          required
        ></InputField>

        <button type="submit" className="login-button">
          Sign up
        </button>
      </form>

      <p className="signup-text">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}
