import React, { useState } from "react";
import "../../styles/postDetail.css";
export default function PostImageSlider({ mediaURL }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  if (!mediaURL || mediaURL.length === 0) {
    return <div className="postcard-img__container">No media available</div>;
  }

  const handlePrevImage = () => {
    if (currentImgIndex > 0) {
      setCurrentImgIndex(currentImgIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImgIndex < mediaURL.length - 1) {
      setCurrentImgIndex(currentImgIndex + 1);
    }
  };

  return (
    <div className="postcard-img__container" style={{ position: "relative" }}>
      <img
        src={mediaURL[currentImgIndex]}
        alt={`post media ${currentImgIndex + 1}`}
        className="postcard-img"
      />

      {mediaURL.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            disabled={currentImgIndex === 0}
            className="img-nav-btn left"
          >
            &#9664;
          </button>
          <button
            onClick={handleNextImage}
            disabled={currentImgIndex === mediaURL.length - 1}
            className="img-nav-btn right"
          >
            &#9654;
          </button>
        </>
      )}
    </div>
  );
}
