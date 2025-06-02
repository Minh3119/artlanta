import React, { useState, useEffect, useRef } from 'react';
import './FollowerList.scss'; // We can reuse the same styles

const FollowingList = ({ userId, count, isOwnProfile, isPrivate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [following, setFollowing] = useState([]);
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

  const fetchFollowing = () => {
    setIsLoading(true);
    fetch(`http://localhost:9999/backend/api/follow?type=following&userId=${userId}`, {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('This profile is private');
          }
          throw new Error('Failed to fetch following list');
        }
        return res.json();
      })
      .then((data) => {
        setFollowing(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching following list:', err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTogglePopup = () => {
    if (isPrivate && !isOwnProfile) {
      setError('This profile is private');
      return;
    }
    
    if (!isOpen) {
      fetchFollowing();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`follower-list ${!isPrivate || isOwnProfile ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
      <button
        onClick={handleTogglePopup}
        className={`flex flex-col items-center ${!isPrivate || isOwnProfile ? 'hover:opacity-75' : ''}`}
        disabled={isPrivate && !isOwnProfile}
      >
        <span className="font-semibold text-gray-900 text-base">{count}</span>
        <span className="text-gray-500 text-xs">following</span>
      </button>

      {isOpen && (!isPrivate || isOwnProfile) && (
        <>
          <div className="follower-list__overlay" onClick={() => setIsOpen(false)} />
          
          <div ref={popupRef} className="follower-list__popup">
            <div className="follower-list__header">
              <div className="follower-list__header-content">
                <h3 className="follower-list__header-content-title">
                  Following {count} {count === 1 ? 'User' : 'Users'}
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
              ) : following.length === 0 ? (
                <div className="follower-list__empty">Not following anyone yet</div>
              ) : (
                <ul className="follower-list__list">
                  {following.map((user) => (
                    <li key={user.id} className="follower-list__item">
                      <a
                        href={`/user/${user.followingId}`}
                        className="follower-list__link"
                      >
                        <div className="follower-list__avatar">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt=""
                              className="follower-list__avatar-img"
                            />
                          ) : (
                            <div className="follower-list__avatar-placeholder">
                              <span>
                                {user.username?.[0]?.toUpperCase() || '?'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="follower-list__user-info">
                          <p className="follower-list__user-info-name">
                            {user.username}
                            {user.isPrivate && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Private)
                              </span>
                            )}
                          </p>
                          <p className="follower-list__user-info-date">
                            Following since {new Date(user.followAt).toLocaleDateString()}
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

export default FollowingList; 