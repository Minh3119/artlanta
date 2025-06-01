import React, { useState } from "react";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import ArtistPost from "../components/HomePage/AritistPost";
import Footer from "../components/HomePage/Footer";
import CreatePostComponent from "../components/PostControl/createPostComponent";
import UpdatePostComponent from "../components/PostControl/updatePostComponent";
import DeletePostComponent from "../components/PostControl/deletePostComponent";


export default function HomePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const openCreatePopup = () => setIsCreateOpen(true);
  const closeCreatePopup = () => setIsCreateOpen(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const openUpdatePopup = () => setIsUpdateOpen(true);
  const closeUpdatePopup = () => setIsUpdateOpen(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const openDeletePopup = () => setIsDeleteOpen(true);
  const closeDeletePopup = () => setIsDeleteOpen(false);


  return (
    <div className="homepage-container">
      <Header openCreatePopup={openCreatePopup} />

      <div className="homepage-time">
        March 22, 2023
      </div>
      <div className="homepage-title">
        Artwork Posts
      </div>

      <ArtistPost
        refetch={isCreateOpen}
        openUpdatePopup={openUpdatePopup}
        openDeletePopup={openDeletePopup}
      />

      <Footer></Footer>

      {/* callComponent */}
      {isCreateOpen ?
        < CreatePostComponent
          closeCreatePopup={closeCreatePopup}
        />
        :
        null
      }
      {isUpdateOpen ?
        < UpdatePostComponent
          closeUpdatePopup={closeUpdatePopup}
        />
        :
        null
      }
      {isDeleteOpen ?
        < DeletePostComponent
          closeDeletePopup={closeDeletePopup}
        />
        :
        null
      }
    </div>
  );
}
