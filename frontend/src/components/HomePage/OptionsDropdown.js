import React, { useState } from 'react';
import dotsIcon from "../../assets/images/dots.svg";
import ReportForm from "./ReportForm";

const OptionsDropdown = ({ openDeletePopup, openUpdatePopup, post, currentID}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleToggle = () => {
    setShowMenu(!showMenu);
  };


  const handleOptionClickUpdate = (postID) => {
    setShowMenu(false);
    openUpdatePopup(postID);
  };

  const handleOptionClickDelete = (postID) => {
    setShowMenu(!showMenu);
    openDeletePopup(postID);
  };

const handleOptionClick = async (option) => {
  if (option === 'block') {
    setShowMenu(false);
    setShowReportForm(true);
  } else if (option === 'save') {
    try {
      const res = await fetch(`http://localhost:9999/backend/api/post/save?postID=${post.postID}`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();
      console.log(data);
      if (data.success) {
        alert("Đã lưu bài viết!");
      } else {
        alert("Lỗi khi lưu bài viết!");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Đã xảy ra lỗi!");
    } finally {
      setShowMenu(false);
    }
  } else {
    console.log(`Clicked: ${option}`);
    setShowMenu(false);
  }
};

  return (
    <>
      <div className="relative inline-block text-left">
        <button onClick={handleToggle} className="dots-btn">
          <img src={dotsIcon} alt="more options" />
        </button>

        {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-black rounded-md shadow-md z-50 p-2 space-y-2 text-sm">
          <button onClick={() => handleOptionClick('save')} className="block w-full text-left px-4 py-2 hover:bg-green-500 hover:text-white rounded">
              {post.isSaved ? 'Unsave Post' : 'Save Post'}
            </button>
            {currentID === post.authorID ? (
              <>
              <button onClick={() => handleOptionClickUpdate(post.postID)} className="block w-full text-left px-4 py-2 hover:bg-green-500 hover:text-white rounded">
                  Edit Post
                </button>
              <button onClick={() => handleOptionClickDelete(post.postID)} className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded">
                  Delete Post
                </button>
              </>
            ) : (
              <button
                onClick={() => handleOptionClick('block')}
                className="text-red-500 block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded hover:bg-red-500 hover:text-white transition">
                Report Post
              </button>
            )}
          </div>
        )}
      </div>

      {showReportForm && (
        <div className="overlay">
          <ReportForm postId={post.postID} onClose={() => setShowReportForm(false)} />
        </div>
      )}
    </>
  );
};

export default OptionsDropdown;
