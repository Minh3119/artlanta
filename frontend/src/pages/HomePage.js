import React, { useState } from "react";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import ArtistPost from "../components/HomePage/AritistPost";
import Footer from "../components/HomePage/Footer";
import CreatePostComponent from "../components/PostControl/createPostComponent";
import UpdatePostComponent from "../components/PostControl/updatePostComponent";
import DeletePostComponent from "../components/PostControl/deletePostComponent";


export default function HomePage() {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const openCreatePopup = () => {
    setIsCreateOpen(true);
    setIsRefresh(true);
  };
  const closeCreatePopup = () => {
    setIsCreateOpen(false);
    setIsRefresh(false);
  };
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updatePostID, setUpdatePostID] = useState(0);
  const openUpdatePopup = (postID) => {
    setUpdatePostID(postID);
    setIsUpdateOpen(true);
    setIsRefresh(true);
  };
  const closeUpdatePopup = () => {
    setIsUpdateOpen(false);
    setIsRefresh(false);
  };
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletePostID, setDeletePostID] = useState(0);
  const openDeletePopup = (postID) => {
    setDeletePostID(postID);
    setIsDeleteOpen(true);
    setIsRefresh(true);
  };
  const closeDeletePopup = () => {
    setIsDeleteOpen(false);
    setIsRefresh(false);
  };


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
        refetch={isRefresh}
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
          updatePostID={updatePostID}
        />
        :
        null
      }
      {isDeleteOpen ?
        < DeletePostComponent
          closeDeletePopup={closeDeletePopup}
          deletePostID={deletePostID}
        />
        :
        null
      }
    </div>
  );
}
