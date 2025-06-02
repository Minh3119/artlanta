import InputField from ".././Login/InputField.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function PassForgetCard() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [otpFromServer, setOTPFromServer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(
          "http://localhost:9999/backend/api/session/check",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.loggedIn) {
          console.log(data);
          navigate("/");
        }
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

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/backend/api/forgetpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage("Email không tồn tại");
        return;
      }

      setMessage("Đã gửi gmail");
      setOTPFromServer(data.otp);
      setStep(2);
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const handleOTP = (e) => {
    e.preventDefault();

    if (otp !== otpFromServer) {
      setMessage("OTP sai");
      setOTP("");
      return;
    }

    setMessage("OTP thành công...");
    setStep(3);
  };

  const handleRePassword = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setMessage(
        "Password phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      );
      return;
    }

    if (newPassword !== cPassword) {
      setMessage("Password phải trùng với Confirm password");
      setCPassword("");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/backend/api/forgetpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step, email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        console.error(data.message || `API Error: ${res.status}`);
        return;
      }

      setMessage("Chuyển thành công");
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
      <h2 className="form-title">Quên mật khẩu</h2>
      {message && (
        <p className="message" style={{ color: "red" }}>
          {message}
        </p>
      )}
      {step === 1 && (
        <form className="login-form" onSubmit={handleEmail}>
          <p className="separator">
            <span>Nhập Email của bạn</span>
          </p>
          <InputField
            type="email"
            placeholder="Email address"
            icon="mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          ></InputField>
          <Link to="/login" className="forgot-pass-link">
            Already remeber?
          </Link>
          <button type="submit" className="login-button">
            Get OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="login-card">
          <form className="login-form" onSubmit={handleOTP}>
            <p className="separator">
              <span>Nhập OTP đã gửi đến mail của bạn</span>
            </p>
            <InputField
              type="text"
              placeholder="OTP"
              icon="view_timeline"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              required
            ></InputField>
            <Link to="/login" className="forgot-pass-link">
              Already remeber?
            </Link>
            <button type="submit" className="login-button">
              Submit
            </button>
          </form>
        </div>
      )}

      {step === 3 && (
        <div className="login-card">
          <form className="login-form" onSubmit={handleRePassword}>
            <p className="separator">
              <span>Chuyển mật khẩu</span>
            </p>
            <InputField
              type="password"
              placeholder="Password"
              icon="lock"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            ></InputField>
            <InputField
              type="password"
              placeholder="Confirm password"
              icon="lock"
              value={cPassword}
              onChange={(e) => setCPassword(e.target.value)}
              required
            ></InputField>
            <Link to="/login" className="forgot-pass-link">
              Already remeber?
            </Link>
            <button type="submit" className="login-button">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
