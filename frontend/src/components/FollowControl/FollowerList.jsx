// ==================== Follower List Component ====================
// Displays a list of users who follow the target user, with privacy controls
import React, { useState, useEffect, useRef } from 'react';
import './FollowerList.scss';

const FollowerList = ({ userId, count, isOwnProfile, isPrivate }) => {
  // -------------------- State Management --------------------
  const [isOpen, setIsOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);

  // -------------------- Click Outside Handler --------------------
  // Closes the follower list popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // -------------------- Data Fetching --------------------
  // Fetches the list of followers from the API
  const fetchFollowers = () => {
    setIsLoading(true);
    fetch(`http://localhost:9999/backend/api/follow?type=list&userId=${userId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('This profile is private');
          }
          throw new Error('Failed to fetch followers');
        }
        return res.json();
      })
      .then((data) => {
        setFollowers(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching followers:', err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // -------------------- Event Handlers --------------------
  // Handles opening/closing the follower list popup
  const handleTogglePopup = () => {
    if (isPrivate && !isOwnProfile) {
      setError('This profile is private');
      return;
    }
    
    if (!isOpen) {
      fetchFollowers();
    }
    setIsOpen(!isOpen);
  };

  // -------------------- Component Render --------------------
  return (
    <div className={`follower-list ${!isPrivate || isOwnProfile ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
      {/* Follower Count Button */}
      <button
        onClick={handleTogglePopup}
        className={`flex flex-col items-center ${!isPrivate || isOwnProfile ? 'hover:opacity-75' : ''}`}
        disabled={isPrivate && !isOwnProfile}
      >
        <span className="font-semibold text-gray-900 text-base">{count}</span>
        <span className="text-gray-500 text-xs">followers</span>
      </button>

      {/* Follower List Popup */}
      {isOpen && (!isPrivate || isOwnProfile) && (
        <>
          {/* Overlay */}
          <div className="follower-list__overlay" onClick={() => setIsOpen(false)} />
          
          {/* Popup Content */}
          <div ref={popupRef} className="follower-list__popup">
            {/* Header */}
            <div className="follower-list__header">
              <div className="follower-list__header-content">
                <h3 className="follower-list__header-content-title">
                  {count} {count === 1 ? 'Follower' : 'Followers'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="follower-list__close-button"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="follower-list__content">
              {/* Loading State */}
              {isLoading ? (
                <div className="follower-list__loading">
                  <div className="follower-list__loading-spinner" />
                </div>
              ) : error ? (
                // Error State
                <div className="follower-list__error">{error}</div>
              ) : followers.length === 0 ? (
                // Empty State
                <div className="follower-list__empty">No followers yet</div>
              ) : (
                // Follower List
                <ul className="follower-list__list">
                  {followers.map((follower) => (
                    <li key={follower.id} className="follower-list__item">
                      <a
                        href={`/user/${follower.followerId}`}
                        className="follower-list__link"
                      >
                        {/* Follower Avatar */}
                        <div className="follower-list__avatar">
                          {follower.avatarUrl ? (
                            <img
                              src={follower.avatarUrl}
                              alt=""
                              className="follower-list__avatar-img"
                            />
                          ) : (
                            <div className="follower-list__avatar-placeholder">
                              <span>
                                {follower.username?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Follower Info */}
                        <div className="follower-list__user-info">
                          <p className="follower-list__user-info-name">
                            {follower.username}
                            {follower.isPrivate && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Private)
                              </span>
                            )}
                          </p>
                          <p className="follower-list__user-info-date">
                            Followed on {new Date(follower.followAt).toLocaleDateString()}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FollowerList; 