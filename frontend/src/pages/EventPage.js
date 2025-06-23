import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/homepage.css";
import Header from "../components/HomePage/Header";
import CreateEventComponent from "../components/Event/CreateEventComponent";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostImageSlider from '../components/HomePage/PostImageSlider';
import '../styles/event.scss';

export default function EventPage() {
  const [currentID, setCurrentID] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:9999/backend/api/events', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Fetch posts for each event
      const eventsWithPosts = await Promise.all(data.events.map(async event => {
        const postsResponse = await fetch(`http://localhost:9999/backend/api/event/post/${event.eventId}`, {
          credentials: 'include'
        });
        const postsData = await postsResponse.json();
        return {
          ...event,
          posts: postsData.posts || []
        };
      }));

      setEvents(eventsWithPosts);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const openCreatePopup = (type) => {
    if (type === 'event') {
      setIsEventOpen(true);
      setIsRefresh(true);
    }
  };

  const closeCreatePopup = () => {
    setIsEventOpen(false);
    setIsRefresh(false);
  };

  const today_formatted = format(new Date(), "MMMM d, yyyy");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Add handlers for follow and join
  const handleFollow = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:9999/backend/api/event/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventId })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Followed event!');
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to follow event');
      }
    } catch (error) {
      toast.error('Failed to follow event');
    }
  };

  const handleJoin = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:9999/backend/api/event/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventId })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Joined event!');
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to join event');
      }
    } catch (error) {
      toast.error('Failed to join event');
    }
  };

  // Helper to get current user's status for an event
  const getUserEventStatus = (event) => {
    if (!event.followers) return null;
    const follower = event.followers.find(f => f.userId === currentID);
    return follower ? follower.status : null;
  };

  // Unfollow and Unjoin handlers
  const handleUnfollow = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:9999/backend/api/event/follow?eventId=${eventId}&userId=${currentID}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success !== false) {
        toast.success('Unfollowed event!');
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to unfollow event');
      }
    } catch (error) {
      toast.error('Failed to unfollow event');
    }
  };
  const handleUnjoin = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:9999/backend/api/event/join?eventId=${eventId}&userId=${currentID}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success !== false) {
        toast.success('Unjoined event!');
        fetchEvents();
      } else {
        toast.error(data.error || 'Failed to unjoin event');
      }
    } catch (error) {
      toast.error('Failed to unjoin event');
    }
  };

  // Add handler for not interested
  const handleNotInterested = async (eventId) => {
    try {
      // Unfollow/unjoin by deleting any status
      await fetch(`http://localhost:9999/backend/api/event/follow?eventId=${eventId}&userId=${currentID}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await fetch(`http://localhost:9999/backend/api/event/join?eventId=${eventId}&userId=${currentID}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchEvents();
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  return (
    <div className="homepage-container" id="scrollableDiv" style={{ overflow: "auto" }}>
      <Header openCreatePopup={openCreatePopup} />

      <div className="homepage-time">
        <p>{today_formatted}</p>
      </div>

      <div className="homepage-title">
        <div className="tab-buttons">
          <Link to="/homepage">
            <button className="tab-button">
              Artwork Posts
            </button>
          </Link>

          <Link to="/event">
            <button className="tab-button active">
              Events
            </button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <span>Loading...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="no-events-message">
          <p>No events found</p>
        </div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.eventId} className="event-card">
              <div className="event-header">
                <div className="event-info">
                  <h2 className="event-title">{event.title}</h2>
                  <div className="event-metadata">
                    <span className="event-date">
                      {formatDate(event.startTime)} - {formatDate(event.endTime)}
                    </span>
                    <span className="event-location">{event.location}</span>
                  </div>
                </div>
                {event.imageUrl && (
                  <img src={event.imageUrl} alt={event.title} className="event-cover-image" />
                )}
              </div>

              <p className="event-description">{event.description}</p>

              {event.posts && event.posts.length > 0 && (
                <div className="event-posts">
                  <h3>Related Posts</h3>
                  <div className="posts-grid">
                    {event.posts.map((post) => (
                      <Link to={`/post/${post.ID}`} key={post.ID} className="post-card">
                        <div className="post-content">
                          <p>{post.content}</p>
                          {post.mediaURL && post.mediaURL.length > 0 && (
                            <PostImageSlider mediaURL={post.mediaURL} />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="event-footer">
                <div className="event-stats">
                  <span>{event.interestedCount || 0} following</span>
                  <span>{event.goingCount || 0} join</span>
                </div>
                <div className="event-actions-dropdown">
                  {(() => {
                    const status = getUserEventStatus(event);
                    let dropTitle = "Not interested";
                    if (status === "interested") dropTitle = "Following";
                    else if (status === "going") dropTitle = "Joining";
                    return (
                      <details className="dropdown">
                        <summary className="dropdown-button">
                          {dropTitle}
                          <span className="dropdown-arrow" aria-hidden="true" style={{marginLeft: 12, fontSize: 18, display: 'inline-block', transition: 'transform 0.2s'}}>
                            ▼
                          </span>
                        </summary>
                        <div className="dropdown-content animated-dropdown">
                          <label className="dropdown-option">
                            <input
                              type="radio"
                              name={`action-${event.eventId}`}
                              checked={status === null}
                              onChange={() => handleNotInterested(event.eventId)}
                            />
                            Not interested
                          </label>
                          <label className="dropdown-option">
                            <input
                              type="radio"
                              name={`action-${event.eventId}`}
                              checked={status === "interested"}
                              onChange={() => handleFollow(event.eventId)}
                            />
                            Follow
                          </label>
                          <label className="dropdown-option">
                            <input
                              type="radio"
                              name={`action-${event.eventId}`}
                              checked={status === "going"}
                              onChange={() => handleJoin(event.eventId)}
                            />
                            Join
                          </label>
                        </div>
                      </details>
                    );
                  })()}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {isEventOpen && (
        <CreateEventComponent closeEventPopup={closeCreatePopup} />
      )}

      <ToastContainer />
    </div>
  );
}
