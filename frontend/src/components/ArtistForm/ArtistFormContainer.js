import imgs from "../../assets/images/img-artistPost.svg";
import icon from "../../assets/images/img-artistIcon.svg";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ArtistForm from "./ArtistForm";
import { useNavigate } from "react-router-dom";
import "../../styles/ArtistForm.css";

export default function ArtistFormContainer() {
  const [showModal, setShowModal] = useState(false);
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
        console.log("HMM");
        if (!data.loggedIn) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };

    checkLogin();
  }, []);

  const handleLetsGoClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className="artist-form">
      <div className="artist-form__navbar">
        <div className="artist-form__item">
          <img src={icon} alt="" />
          <p className="artist-form__nav">Art Commision</p>
        </div>
        <Link to="/" className="artist-form__cancel-a">
          <div className="artist-form__cancel">
            <p className="artist-form__para">Back to homepage top</p>
          </div>
        </Link>
      </div>

      <p className="artist-form__title">BECOME A</p>

      <p className="artist-form__title">
        <span className="title-span">Artist </span>
        in Artlanta
      </p>

      <img src={imgs} alt="" className="artist-form__imgDeco" />

      <div className="form-submit__container">
        <div className="form-submit__item" onClick={handleLetsGoClick}>
          <p>Let's go</p>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-content">
            <ArtistForm />
          </div>
        </div>
      )}
    </div>
  );
}
