package model;

import java.time.LocalDateTime;

/**
 * EventFollower model class representing a user's relationship with an event.
 * This class maps to the 'event_followers' table in the database.
 * It tracks user attendance status for events (interested, going, not going).
 */
public class EventFollower {
    // Composite primary key
    private int eventId;    // Foreign key to events table
    private int userId;     // Foreign key to Users table
    
    // Attendance status
    private String status; // Values: "interested", "going", "not_going"
    
    // Timestamp
    private LocalDateTime createdAt;
    
    /**
     * Default constructor
     */
    public EventFollower() {
    }
    
    /**
     * Constructor with essential fields
     * @param eventId The ID of the event
     * @param userId The ID of the user
     * @param status The attendance status
     */
    public EventFollower(int eventId, int userId, String status) {
        this.eventId = eventId;
        this.userId = userId;
        this.status = status;
    }
    
    // Getters and Setters
    public int getEventId() {
        return eventId;
    }
    
    public void setEventId(int eventId) {
        this.eventId = eventId;
    }
    
    public int getUserId() {
        return userId;
    }
    
    public void setUserId(int userId) {
        this.userId = userId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 