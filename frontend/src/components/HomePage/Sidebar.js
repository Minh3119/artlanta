import React from "react";
import { Link } from "react-router-dom";
import link1 from "../../assets/images/link_1.svg";
import link2 from "../../assets/images/link_2.svg";
import link3 from "../../assets/images/link_3.svg";
import link4 from "../../assets/images/link_4.svg";
import link5 from "../../assets/images/link_5.svg";
import link6 from "../../assets/images/link_6.svg";
import link7 from "../../assets/images/link_7.svg";
import link8 from "../../assets/images/link_8.svg";
import logo from "../../assets/images/Logo-homepage.svg";

export default function Sidebar() {
  return (
    <div className="sidebar-container col-1">
      <div className="logo-container">
        <Link to="#!" className="nav-link">
          <img src={logo} alt=""></img>
        </Link>
      </div>
      <div className="nav-container">
        <Link to="#!" className="nav-link">
          <img src={link1} alt=""></img>
        </Link>
        <Link to="#!" className="nav-link">
          <img src={link2} alt=""></img>
        </Link>
        <Link to="#!" className="nav-link">
          <img src={link3} alt=""></img>
        </Link>
        <Link to="#!" className="nav-link">
          <img src={link4} alt=""></img>
        </Link>
        <Link to="#!" className="nav-link">
          <img src={link5} alt=""></img>
        </Link>
        <Link to="#!" className="nav-link">
          <img src={link6} alt=""></img>
        </Link>
        <Link to="#!" className="nav-link">
          <img src={link7} alt=""></img>
        </Link>
        <Link to="#!" className="nav-link">
          <img src={link8} alt=""></img>
        </Link>
      </div>
    </div>
  );
}
