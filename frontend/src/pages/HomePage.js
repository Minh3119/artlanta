import React from "react";
import "../styles/homepage.css";
import Sidebar from "../components/HomePage/Sidebar";

export default function HomePage() {
  return (
      <div className="homepage-container row">
        <Sidebar></Sidebar>
        <div className="col-10">Main content</div>
      </div>
  );
}
