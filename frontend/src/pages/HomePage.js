import React from "react";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import ArtistPost from "../components/HomePage/AritistPost";
import Footer from "../components/HomePage/Footer";


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

      <Footer></Footer>
    </div>
  );
}
