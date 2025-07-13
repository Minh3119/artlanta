package model;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Event model class representing an event in the system.
 * This class maps to the 'events' table in the database.
 */
public class Event {
    // Primary key
    private int eventId;
    
    // Basic event information
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    
    // Relations and media
    private int creatorId;      // Foreign key to Users table
    private String imageUrl;    // URL to event image (stored in Cloudinary)
    private List<Post> posts;   // List of posts associated with this event
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Event attendance tracking
    private List<EventFollower> followers;  // List of users following/attending the event
    private int followerCount;              // Total number of followers
    private int goingCount;                 // Number of users marked as 'going'
    private int interestedCount;            // Number of users marked as 'interested'
    private int postCount;                  // Total number of posts in this event
    
    /**
     * Default constructor
     */
    public Event() {
    }
    
    /**
     * Constructor with all required fields
     */
    public Event(int eventId, String title, String description, LocalDateTime startTime, 
                LocalDateTime endTime, String location, int creatorId, String imageUrl) {
        this.eventId = eventId;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.creatorId = creatorId;
        this.imageUrl = imageUrl;
    }
    
    // Getters and Setters
    public int getEventId() {
        return eventId;
    }
    
    public void setEventId(int eventId) {
        this.eventId = eventId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalDateTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public int getCreatorId() {
        return creatorId;
    }
    
    public void setCreatorId(int creatorId) {
        this.creatorId = creatorId;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<EventFollower> getFollowers() {
        return followers;
    }
    
    public void setFollowers(List<EventFollower> followers) {
        this.followers = followers;
    }
    
    public int getFollowerCount() {
        return followerCount;
    }
    
    public void setFollowerCount(int followerCount) {
        this.followerCount = followerCount;
    }
    
    public int getGoingCount() {
        return goingCount;
    }
    
    public void setGoingCount(int goingCount) {
        this.goingCount = goingCount;
    }
    
    public int getInterestedCount() {
        return interestedCount;
    }
    
    public void setInterestedCount(int interestedCount) {
        this.interestedCount = interestedCount;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    public int getPostCount() {
        return postCount;
    }

    public void setPostCount(int postCount) {
        this.postCount = postCount;
    }
} 