import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/homepage.css";
import LivePageComponent from "../components/LiveStream/livePageComponent";
import Header from "../components/HomePage/Header";
import ArtistPost from "../components/HomePage/ArtistPost";
import CreatePostComponent from "../components/PostControl/createPostComponent";
import UpdatePostComponent from "../components/PostControl/updatePostComponent";
import DeletePostComponent from "../components/PostControl/deletePostComponent";
import CreateEventComponent from "../components/Event/CreateEventComponent";
import EventPage from "./EventPage";
import SavedPostPage from "./SavedPostPage";
import SavePost from "../components/HomePage/SavePost";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HomePage() {
  const [currentID, setCurrentID] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [createType, setCreateType] = useState(null); // 'post' or 'event'
  const [selectedTab, setSelectedTab] = useState('post'); // 'post' or 'event'

  useEffect(() => {
    if (location.state?.success) {
      toast.success(location.state.success);
    }
    if (location.state?.error) {
      toast.error(location.state.error);
    }

    if (location.state) {
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    fetch("http://localhost:9999/backend/api/user/userid", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentID(data.response.userID);
      })
      .catch((err) => console.error(err));
  }, []);

  const [isRefresh, setIsRefresh] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Unified popup handler
  const openCreatePopup = (type) => {
    setCreateType(type); // 'post' or 'event'
    setIsCreateOpen(true);
    // setIsRefresh(!isRefresh);
  };

  const closeCreatePopup = (shouldRefresh = false) => {
    setIsCreateOpen(false);
    setCreateType(null);
    // if (shouldRefresh) setIsRefresh((prev) => !prev);
    setIsRefresh(!isRefresh);
  };

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [updatePostID, setUpdatePostID] = useState(0);
  const openUpdatePopup = (postID) => {
    setUpdatePostID(postID);
    setIsUpdateOpen(true);
    // setIsRefresh(!isRefresh);
  };
  const closeUpdatePopup = () => {
    setIsUpdateOpen(false);
    setIsRefresh(!isRefresh); // Keep this to refresh after closing // Keep this to refresh after closing
  };
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletePostID, setDeletePostID] = useState(0);
  const openDeletePopup = (postID) => {
    setDeletePostID(postID);
    setIsDeleteOpen(true);
    //setIsRefresh(!isRefresh);sRefresh);
  };
  const closeDeletePopup = () => {
    setIsDeleteOpen(false);
    setIsRefresh(!isRefresh); // Keep this to refresh after closing // Keep this to refresh after closing
  };

  const today_formatted = format(new Date(), "MMMM d, yyyy");

  // Add this function to record post view history
  const addToHistory = useCallback(async (postId, artistId) => {
    try {
      await fetch("http://localhost:9999/backend/api/history/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ postId, artistId }),
      });
    } catch (err) {
      // Optionally handle error
      console.error("Failed to add to history", err);
    }
  }, []);
  const handleChangePage = () => {
    switch (selectedTab) {
      case "post":
        return <ArtistPost
          refetch={isRefresh}
          currentID={currentID}
          openUpdatePopup={openUpdatePopup}
          openDeletePopup={openDeletePopup}
          scrollableTarget="scrollableDiv"
          addToHistory={addToHistory}
        />
      case "live":
        return <LivePageComponent />
      case "event":
        return <EventPage />
      case "saved":
        return <SavePost />
    }
  }
  return (
    <div className="homepage-container" id="scrollableDiv" style={{ overflowX: 'hidden' }}>
      {/* Pass the type to openCreatePopup */}
      <Header openCreatePopup={openCreatePopup} />

      <div className="homepage-time">
        <p>{today_formatted}</p>
      </div>
      <div className="homepage-title">
        <div className="tab-buttons">
          {/* <Link to="/saved"> */}
          <button
            className={`tab-button ${selectedTab === 'saved' ? 'active' : ''}`}
            onClick={() => setSelectedTab('saved')}
          >
            Saved
          </button>
          {/* </Link> */}
          <Link to="/homepage">
            <button
              className={`tab-button ${selectedTab === 'post' ? 'active' : ''}`}
              onClick={() => setSelectedTab('post')}
            >
              Artwork Posts
            </button>
          </Link>
          {/* <Link to="/event"> */}
          <button
            className={`tab-button ${selectedTab === 'event' ? 'active' : ''}`}
            onClick={() => setSelectedTab('event')}
          >
            Event
          </button>
          {/* </Link> */}
          {/* <Link to="/live"> */}
          <button
            className={`tab-button ${selectedTab === 'live' ? 'active' : ''}`}
            onClick={() => setSelectedTab('live')}
          >
            Live
          </button>
          {/* </Link> */}
        </div>
      </div>
      {/* <ArtistPost
        refetch={isRefresh}
        currentID={currentID}
        openUpdatePopup={openUpdatePopup}
        openDeletePopup={openDeletePopup}
        scrollableTarget="scrollableDiv"
        addToHistory={addToHistory}
      /> */}

      {
        // selectedTab === 'post' ?
        //   <ArtistPost
        //     refetch={isRefresh}
        //     currentID={currentID}
        //     openUpdatePopup={openUpdatePopup}
        //     openDeletePopup={openDeletePopup}
        //     scrollableTarget="scrollableDiv"
        //     addToHistory={addToHistory}
        //   />
        //   :
        //   <LivePageComponent />
        handleChangePage()
      }

      {/* Unified create popup */}
      {
        isCreateOpen && createType === 'post' && (
          <CreatePostComponent closeCreatePopup={closeCreatePopup} />
        )
      }
      {
        isCreateOpen && createType === 'event' && (
          <CreateEventComponent closeEventPopup={closeCreatePopup} />
        )
      }

      {
        isUpdateOpen && (
          <UpdatePostComponent
            closeUpdatePopup={closeUpdatePopup}
            updatePostID={updatePostID}
          />
        )
      }
      {
        isDeleteOpen && (
          <DeletePostComponent
            closeDeletePopup={closeDeletePopup}
            deletePostID={deletePostID}
          />
        )
      }
    </div >
  );
}
