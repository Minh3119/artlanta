import close from "../../assets/images/close.svg";
import arrowLeft from "../../assets/images/arrow-left.svg";
import { useEffect } from "react";
import "../../styles/report.css";
import ReportLink from "./ReportLink";

export default function Report() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (root) {
      root.classList.add("rep-root");
    }
    return () => {
      if (root) {
        root.classList.remove("rep-root");
      }
    };
  }, []);

  return (
    <div className="report-container">
      <div className="report-header__container">
        <div className="report-back">
          <img src={arrowLeft} alt="back" />
        </div>
        <div className="report-title__container">
          <p className="report-title">Report</p>
        </div>
        <div className="report-close">
          <img src={close} alt="close" />
        </div>
      </div>
      <div className="report-body__container">
        <div className="report-upper__container">
          <p className="report-upper__title">
            Why are you reporting this post?
          </p>
          <p className="report-upper__desc">
            Your report is anonymous. If someone is in immediate danger, call
            the local emergency services - don't wait.
          </p>
        </div>
        <div className="report-bottom__container">
            <ReportLink content="I just don't like it" link="#"></ReportLink>
            <ReportLink content="Bullying or unwanted contact" link="#"></ReportLink>
            <ReportLink content="Suicide, self-injury or eating disorders" link="#"></ReportLink>
            <ReportLink content="Violence, hate or exploitation" link="#"></ReportLink>
            <ReportLink content="Selling or promoting restricted items" link="#"></ReportLink>
            <ReportLink content="Nudity or sexual activity" link="#"></ReportLink>
            <ReportLink content="Scam, fraud or spam" link="#"></ReportLink>
            <ReportLink content="False information" link="#"></ReportLink>
            <ReportLink content="Intellectual property" link="#"></ReportLink>
        </div>
      </div>
    </div>
  );
}