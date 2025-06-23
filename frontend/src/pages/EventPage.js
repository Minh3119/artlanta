import React, { useState, useEffect } from "react";
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
                  <span>{event.interestedCount || 0} interested</span>
                  <span>{event.goingCount || 0} going</span>
                </div>
                <div className="event-actions">
                  <button className="btn-interested">Interested</button>
                  <button className="btn-going">Going</button>
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
