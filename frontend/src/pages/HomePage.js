import React, { useState } from "react";
import "../styles/homepage.css";
import Header from "../components/HomePage/Heaer";
import ArtistPost from "../components/HomePage/AritistPost";
import Footer from "../components/HomePage/Footer";
import CreatePostComponent from "../components/PostControl/createPostComponent";


export default function HomePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const openCreatePopup = () => setIsCreateOpen(true);
  const closeCreatePopup = () => setIsCreateOpen(false);

  return (
    <div className="homepage-container">
      <Header openCreatePopup={openCreatePopup} />

      <div className="homepage-time">
        March 22, 2023
      </div>
      <div className="homepage-title">
        Artwork Posts
      </div>

      <ArtistPost></ArtistPost>

      <Footer></Footer>

      {/* callComponent */}
      {isCreateOpen ?
        < CreatePostComponent closeCreatePopup={closeCreatePopup} />
        :
        null
      }
    </div>
  );
}
