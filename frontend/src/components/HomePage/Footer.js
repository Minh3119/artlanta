import { Link } from "react-router-dom";
import tick from "../../assets/images/tick.svg";

export default function Footer() {
  return (
    <div className="homepage-footer">
      <img src={tick} alt="" className="footer-img"></img>
      <p className="footer-hi">That's all for today!</p>
      <p className="footer-bye">Come back tomorrow for more inspiration</p>

      <a href="#">
        <div className="footer-back">
            <p className="footer-back__inner">Back to homepage top</p>
        </div>
      </a>
    </div>
  );
}
