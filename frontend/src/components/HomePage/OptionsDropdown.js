import React, { useState } from 'react';
import dotsIcon from "../../assets/images/dots.svg";
import ReportForm from "./ReportForm";

const OptionsDropdown = ({ openDeletePopup, openUpdatePopup, post, currentID }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleOptionClick = (option) => {
    if (option === 'block') {
      setShowMenu(false);
      setShowReportForm(true);
    } else {
      console.log(`Clicked: ${option}`);
      setShowMenu(false);
    }
  };

  const handleOptionClickUpdate = (postID) => {
    setShowMenu(false);
    openUpdatePopup(postID);
  };

  const handleOptionClickDelete = (postID) => {
    setShowMenu(!showMenu);
    openDeletePopup(postID);
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
              Save Post
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
