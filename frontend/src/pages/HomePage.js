import React, { useState, useEffect } from "react";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import ArtistPost from "../components/HomePage/AritistPost";
import Footer from "../components/HomePage/Footer";
import CreatePostComponent from "../components/PostControl/createPostComponent";
import UpdatePostComponent from "../components/PostControl/updatePostComponent";
import DeletePostComponent from "../components/PostControl/deletePostComponent";
import { format } from 'date-fns';

export default function HomePage() {
  const [currentID, setCurrentID] = useState(0);

  useEffect(() => {
    fetch("http://localhost:9999/backend/api/user/userid", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentID(data.response.userID);
      })
      .catch((err) => console.error(err));
  }, []);

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

  const today_formatted = format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="homepage-container">
      <Header openCreatePopup={openCreatePopup} />

      <div className="homepage-time">
        <p>{today_formatted}</p>
      </div>
      <div className="homepage-title">
        Artwork Posts
      </div>

      <ArtistPost
        refetch={isRefresh}
        currentID={currentID}
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
