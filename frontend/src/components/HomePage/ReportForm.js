import close from "../../assets/images/close.svg";
import arrowRight from "../../assets/images/arrow-right.svg";
import { useEffect, useState } from "react";
import "../../styles/report.css";

export default function ReportForm({ postId, onClose }) {
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const root = document.getElementById("root");
    if (root) root.classList.add("rep-root");
    return () => root && root.classList.remove("rep-root");
  }, []);

  const reasons = [
    "I just don't like it",
    "Bullying or unwanted contact",
    "Suicide, self-injury or eating disorders",
    "Violence, hate or exploitation",
    "Selling or promoting restricted items",
    "Nudity or sexual activity",
    "Scam, fraud or spam",
    "False information",
    "Intellectual property"
  ];

 const handleReport = async (reason) => {
  try {
    const res = await fetch(
      `http://localhost:9999/backend/api/post/report?postId=${postId}&reason=${encodeURIComponent(reason)}`,
      {
        method: "POST",
        credentials: "include"
      }
    );
    const data = await res.json();

    if (data.status === "success") {
      setSuccessMessage("Report Sucessfully.");
      setTimeout(() => {
        onClose();
      }, 1000); // đợi 1 giây rồi tự đóng
    } else {
      alert("Failed to submit report: " + data.message);
    }
  } catch (error) {
    console.error("Error reporting:", error);
    alert("An error occurred while reporting.");
  }
};


  return (
    <div className="report-container">
      <div className="report-header__container">
        <div className="report-title__container">
          <p className="report-title">Report</p>
        </div>
        <div className="report-close" onClick={onClose}>
          <img src={close} alt="close" />
        </div>
      </div>

      <div className="report-body__container">
        <div className="report-upper__container">
          <p className="report-upper__title">Why are you reporting this post?</p>
          <p className="report-upper__desc">
            Your report is anonymous. If someone is in immediate danger, call
            the local emergency services - don't wait.
          </p>
        </div>

        <div className="report-bottom__container">
          {reasons.map((reason, index) => (
            <button
              key={index}
              className="report-card"
              onClick={() => handleReport(reason)}
            >
              <p className="report-card__content">{reason}</p>
              <div className="report-card__imgContainer">
                <img className="report-card__img" src={arrowRight} alt="go" />
              </div>
            </button>
          ))}
        </div>

        {successMessage && (
          <div className="report-success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
}
