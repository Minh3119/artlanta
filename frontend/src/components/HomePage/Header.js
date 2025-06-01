import { Link } from "react-router-dom";
import arlanta from "../../assets/images/arlanta.svg";
import arrowDown from "../../assets/images/arrow-down.svg";
import search from "../../assets/images/search.svg";
import noti from "../../assets/images/notification.svg";
import chat from "../../assets/images/chat.svg";
import ava from "../../assets/images/avatar.svg";

export default function Header({ openCreatePopup }) {

  return (
    <div className="header-container">
      <div className="header-logo">
        <Link to="#">
          <img src={arlanta} alt="Artlanta" />
        </Link>
      </div>
      <div className="header-navbar">
        <Link to="#">
          <div className="header-navbar__container">
            <p className="header-navbar__title">Home</p>
          </div>
        </Link>
        <Link to="#">
          <div className="header-navbar__container active">
            <p className="header-navbar__title">Today</p>
          </div>
        </Link>
        <div className="header-navbar__container"
          onClick={openCreatePopup}
          style={{ cursor: "pointer" }}>
          <p className="header-navbar__title">Create</p>
          <img src={arrowDown} alt=""></img>
        </div>
      </div>
      <div className="header-search">
        <input
          type="text"
          className="header-text-input"
          placeholder="Seach"
        ></input>
        <img src={search} alt="" className="search-icon"></img>
      </div>
      <div className="header-icons">
        <Link to="#">
          <img src={noti} alt="noti"></img>
        </Link>
        <Link to="#">
          <img src={chat} alt="chat"></img>
        </Link>

        <div className="header-more">
          <Link to="#">
            <img src={ava} alt="ava"></img>
          </Link>
          <Link to="#">
            <img src={arrowDown} alt="more"></img>
          </Link>
        </div>
      </div>
    </div>
  );
}
