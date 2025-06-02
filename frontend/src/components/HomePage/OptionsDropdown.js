import React, { useState } from 'react';
import dotsIcon from "../../assets/images/dots.svg";

const OptionsDropdown = ({ openDeletePopup, openUpdatePopup, post, currentID }) => {
  const [showMenu, setShowMenu] = useState(false);


  const handleToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleOptionClick = (option) => {
    console.log(`Clicked: ${option}`);
    setShowMenu(false);
  };
  const handleOptionClickUpdate = (postID) => {
    setShowMenu(!showMenu);
    openUpdatePopup(postID);
  }
  const handleOptionClickDelete = (postID) => {
    setShowMenu(!showMenu);
    openDeletePopup(postID);
  }
  return (
    <div className="relative inline-block text-left">
      <button onClick={handleToggle} className="dots-btn">
        <img src={dotsIcon} alt="more options" />
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-black text-white rounded-md shadow-lg z-50 p-2 space-y-1 text-sm">
          <button onClick={() => handleOptionClick('save')} className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded">
            Lưu
          </button>
          {currentID === post.authorID ?
            <>
              <button onClick={() => handleOptionClickUpdate(post.postID)} className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded">
                Sửa bài viết
              </button>
              <button onClick={() => handleOptionClickDelete(post.postID)} className="block w-full text-left px-4 py-2 hover:bg-gray-800 rounded">
                Xóa bài viết
              </button>
            </>
            :
            <button onClick={() => handleOptionClick('block')} className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-800 rounded">
              Báo cáo
            </button>
          }


        </div>
      )}
    </div>
  );
};

export default OptionsDropdown;
