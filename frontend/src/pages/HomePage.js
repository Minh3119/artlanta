import React from "react";
import "../styles/homepage.css";
import Header from "../components/HomePage/Heaer";
import ArtistPost from "../components/HomePage/AritistPost";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <Header></Header>

      <div className="homepage-time">
        March 22, 2023
      </div>
      <div className="homepage-title">
        Artwork Posts
      </div>

      <ArtistPost></ArtistPost>
    </div>
  );
}
