import React, { useState, useEffect, useRef } from 'react';
import './FollowerList.scss';

const FollowerList = ({ userId, count, isOwnProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchFollowers = () => {
    setIsLoading(true);
    fetch(`http://localhost:9999/backend/api/follow?type=list&userId=${userId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
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

  const handleTogglePopup = () => {
    if (!isOwnProfile) return; // Don't do anything if not owner
    if (!isOpen) {
      fetchFollowers();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`follower-list ${isOwnProfile ? 'cursor-pointer' : 'cursor-default'}`}>
      <button
        onClick={handleTogglePopup}
        className={`flex flex-col items-center ${isOwnProfile ? 'hover:opacity-75' : ''}`}
        disabled={!isOwnProfile}
      >
        <span className="font-semibold text-gray-900 text-base">{count}</span>
        <span className="text-gray-500 text-xs">followers</span>
      </button>

      {isOpen && isOwnProfile && (
        <>
          <div className="follower-list__overlay" onClick={() => setIsOpen(false)} />
          
          <div ref={popupRef} className="follower-list__popup">
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

            <div className="follower-list__content">
              {isLoading ? (
                <div className="follower-list__loading">
                  <div className="follower-list__loading-spinner" />
                </div>
              ) : error ? (
                <div className="follower-list__error">{error}</div>
              ) : followers.length === 0 ? (
                <div className="follower-list__empty">No followers yet</div>
              ) : (
                <ul className="follower-list__list">
                  {followers.map((follower) => (
                    <li key={follower.id} className="follower-list__item">
                      <a
                        href={`/user/${follower.followerId}`}
                        className="follower-list__link"
                      >
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
                        <div className="follower-list__user-info">
                          <p className="follower-list__user-info-name">
                            {follower.username}
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