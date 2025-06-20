import { useEffect, useState } from "react";
import "../../styles/suggestfollow.css";
import { useNavigate } from "react-router-dom";

export default function SuggestFollow() {
  const [userSuggest, SetUserSuggest] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:9999/backend/api/suggestFollow",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        SetUserSuggest(data);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
      }
    };

    fetchSuggestedUsers();
  }, []);

  useEffect(() => {
    const slider = document.querySelector(".suggest-follow__container");
    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      slider.classList.add("active");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
      <p className="suggest-follow">Suggested Users to Follow</p>
      <div className="suggest-follow__container">
        {userSuggest.map((userSuggestItem) => (
          <div className="suggest-follow__item">
            <div className="suggest-img__container">
              <a href={`/user/${userSuggestItem.id}`}>
                <img
                  src={userSuggestItem.avatarUrl}
                  alt={userSuggestItem.username}
                />
              </a>
            </div>
            <div className="suggest-username__container">
              
              <a href={`/user/${userSuggestItem.id}`}>
                <p className="suggest-username">{userSuggestItem.username}</p>
              </a>
            </div>
            <div className="suggest-bio__container">
              <p className="suggest-bio">
                {userSuggestItem.bio !== null
                  ? userSuggestItem.bio
                  : "No bio found"}
              </p>
            </div>
            <button className="button-follow" onClick={() => navigate(`/user/${userSuggestItem.id}`)}>Follow</button>
          </div>
        ))}
      </div>
    </div>
  );
}
