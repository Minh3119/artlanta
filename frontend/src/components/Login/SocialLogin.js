import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const SocialLogin = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin =  async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/backend/api/oauth2callbackgoogle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    }
  }

  return (
    <>
        <div className="social-login">
      <button className="social-button">
        <a href="https://accounts.google.com/o/oauth2/auth?client_id=612749939529-nubjikfjccj44tqlandplnec64gtse32.apps.googleusercontent.com&redirect_uri=http://localhost:8080/backend/api/oauth2callbackgoogle&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email&access_type=online" className="social-button__link">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            height="24"
          >
            <path
              fill="#fbc02d"
              d="M43.6 20.5h-1.9V20H24v8h11.3C33.8 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.1-.4-3.5z"
            />
            <path
              fill="#e53935"
              d="M6.3 14.6l6.6 4.8C14.2 16.1 18.7 14 24 14c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.5 6.3 14.6z"
            />
            <path
              fill="#4caf50"
              d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.1C29.5 35.7 26.9 37 24 37c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5c3.2 6.2 9.7 10.9 17.7 10.9z"
            />
            <path
              fill="#1565c0"
              d="M43.6 20.5H24v8h11.3C33.8 32.4 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-9.7 0-17.9 6.3-20.7 15.1l6.5 5C11.4 20.1 17.1 16 24 16c3.5 0 6.7 1.2 9.2 3.1l5.8-5.8C36.2 10.8 30.5 8 24 8c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16c0-1.3-.2-2.5-.4-3.5z"
            />
          </svg>
          Google
        </a>
      </button>
    </div>
    {message && <p className="message">{message}</p>}
    </>
  );
};
export default SocialLogin;
