import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import '../../styles/event.scss';

/**
 * CreateEventComponent - A modal form component for creating events
 * @param {Object} props
 * @param {Function} props.closeEventPopup - Function to close the modal
 */
export default function CreateEventComponent({ closeEventPopup }) {
  // State for form data and UI control
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    imageUrl: '',
    creatorId: null // Will be set from session
  });
  const [error, setError] = useState(''); // For displaying error messages
  const [selectedImage, setSelectedImage] = useState(null); // For image preview
  const [isUploading, setIsUploading] = useState(false); // Loading state during image upload
  const [imageInputType, setImageInputType] = useState('file'); // Toggle between file upload and URL input
  const [userPosts, setUserPosts] = useState([]); // List of user's posts
  const [selectedPosts, setSelectedPosts] = useState([]); // Selected posts to add to event
  
  // Refs for DOM elements
  const popupRef = useRef(null); // Reference to the modal container for click outside detection
  const fileInputRef = useRef(null); // Reference to the file input element

  /**
   * Handles clicks outside the modal to close it
   * @param {Event} event - The click event
   */
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      closeEventPopup();
    }
  };

  // Effect for initialization and cleanup
  useEffect(() => {
    // Fetch the current user's ID when component mounts
    const fetchUserId = async () => {
      try {
        const response = await fetch('http://localhost:9999/backend/api/user/userid', {
          credentials: 'include'
        });
        const data = await response.json();
        setEventData(prev => ({
          ...prev,
          creatorId: data.response.userID
        }));
      } catch (error) {
        console.error('Error fetching user ID:', error);
        toast.error('Failed to fetch user ID');
      }
    };

    fetchUserId();
    
    // Setup click outside listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeEventPopup]);

  useEffect(() => {
    // Fetch user's posts when component mounts
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:9999/backend/api/post/view?includeFriends=true', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setUserPosts(data.response || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast.error('Failed to fetch posts');
      }
    };

    fetchPosts();
  }, []);

  /**
   * Validates that end date is after start date
   * @returns {boolean} True if dates are valid
   */
  const validateDates = () => {
    const startDate = new Date(eventData.startTime);
    const endDate = new Date(eventData.endTime);
    
    if (endDate < startDate) {
      setError('End date cannot be before start date');
      return false;
    }
    setError('');
    return true;
  };

  /**
   * Validates if a string is a valid URL
   * @param {string} url - The URL to validate
   * @returns {boolean} True if URL is valid
   */
  const validateImageUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Handles changes to the image URL input
   * Updates preview if URL is valid
   * @param {Event} e - The change event
   */
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setEventData(prev => ({
      ...prev,
      imageUrl: url
    }));

    // Show preview if it's a valid URL
    if (validateImageUrl(url)) {
      setSelectedImage(url);
    } else {
      setSelectedImage(null);
    }
  };

  /**
   * Handles file upload for images
   * Compresses image and uploads to Cloudinary
   * @param {Event} e - The file input change event
   */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Show preview immediately
      setSelectedImage(URL.createObjectURL(file));

      // Image compression options
      const options = {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      setIsUploading(true);
      const compressedFile = await imageCompression(file, options);
      
      // Prepare and send to server
      const formData = new FormData();
      formData.append('file[]', compressedFile);

      const response = await fetch('http://localhost:9999/backend/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Store the Cloudinary URL
      setEventData(prev => ({
        ...prev,
        imageUrl: data.response[0].URL
      }));

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image: ' + error.message);
      setSelectedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Toggles between file upload and URL input modes
   * Clears existing image data when switching
   */
  const toggleImageInputType = () => {
    setSelectedImage(null);
    setEventData(prev => ({ ...prev, imageUrl: '' }));
    setImageInputType(prev => prev === 'file' ? 'url' : 'file');
  };

  /**
   * Handles form submission
   * Validates all data and sends to server
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!eventData.creatorId) {
      setError('User ID not available');
      toast.error('User ID not available');
      return;
    }

    if (!validateDates()) {
      toast.error('End date cannot be before start date');
      return;
    }

    if (eventData.imageUrl && !validateImageUrl(eventData.imageUrl)) {
      setError('Invalid image URL');
      toast.error('Invalid image URL');
      return;
    }

    try {
      // Send event data to server
      const response = await fetch('http://localhost:9999/backend/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const eventResult = await response.json();

      // Add selected posts to the event
      if (selectedPosts.length > 0) {
        await Promise.all(selectedPosts.map(postId =>
          fetch('http://localhost:9999/backend/api/event/post', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            credentials: 'include',
            body: `eventId=${eventResult.eventId}&postId=${postId}`
          })
        ));
      }

      toast.success('Event created successfully!');
      closeEventPopup();
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMessage = error.message || 'Error creating event';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handlePostSelection = (postId) => {
    setSelectedPosts(prev => {
      if (prev.includes(postId)) {
        return prev.filter(id => id !== postId);
      } else {
        return [...prev, postId];
      }
    });
  };

  /**
   * Handles changes to form inputs
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user makes changes
    if (error) setError('');
  };

  // Component render
  return (
    <div className="create-event-overlay">
      <div className="create-event-popup" ref={popupRef}>
        <div className="create-event-header">
          <h2>Create Event</h2>
          <button className="close-button" onClick={closeEventPopup}>&times;</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="create-event-form">
          {/* Title input */}
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>
          {/* Description input */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              required
            />
          </div>
          {/* Start time input */}
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={eventData.startTime}
              onChange={handleChange}
              required
            />
          </div>
          {/* End time input */}
          <div className="form-group">
            <label>End Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={eventData.endTime}
              onChange={handleChange}
              required
            />
          </div>
          {/* Location input */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>
          {/* Image upload section */}
          <div className="form-group">
            <div className="image-input-header">
              <label>Event Image</label>
              <button 
                type="button" 
                className="toggle-input-type" 
                onClick={toggleImageInputType}
                disabled={isUploading}
              >
                Switch to {imageInputType === 'file' ? 'URL' : 'File'} Upload
              </button>
            </div>
            <div className="image-upload-container">
              {imageInputType === 'file' ? (
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="file-input"
                  disabled={isUploading}
                />
              ) : (
                <input
                  type="url"
                  value={eventData.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Enter image URL"
                  className="url-input"
                  disabled={isUploading}
                />
              )}
              {/* Image preview */}
              {selectedImage && (
                <div className="image-preview">
                  <img src={selectedImage} alt="Preview" />
                </div>
              )}
              {isUploading && <div className="upload-loading">Uploading...</div>}
            </div>
          </div>
          {/* Form action buttons */}
          <div className="form-actions">
            <button type="submit" className="create-button" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Create Event'}
            </button>
            <button 
              type="button" 
              className="cancel-button" 
              onClick={closeEventPopup}
              disabled={isUploading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 