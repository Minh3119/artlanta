package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import model.Event;
import model.EventFollower;

/**
 * Data Access Object for Event-related database operations.
 * Handles all database interactions for events and event followers.
 */
public class EventDAO extends DBContext {
    
    /**
     * Creates a new event in the database
     * @param event The event object to create
     * @return The created event with its generated ID, or null if creation fails
     */
    public Event createEvent(Event event) {
        String sql = "INSERT INTO events (title, description, start_time, end_time, location, creator_id, image_url, created_at, updated_at) "
                + "VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
        
        try {
            PreparedStatement st = connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);
            // Set parameters
            st.setString(1, event.getTitle());
            st.setString(2, event.getDescription());
            st.setTimestamp(3, Timestamp.valueOf(event.getStartTime()));
            st.setTimestamp(4, Timestamp.valueOf(event.getEndTime()));
            st.setString(5, event.getLocation());
            st.setInt(6, event.getCreatorId());
            st.setString(7, event.getImageUrl());
            
            st.executeUpdate();
            
            // Get the generated event ID
            ResultSet rs = st.getGeneratedKeys();
            if (rs.next()) {
                event.setEventId(rs.getInt(1));
            }
            
            return event;
        } catch (SQLException e) {
            System.out.println("Error creating event: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Updates a user's follow status for an event
     * @param eventId The ID of the event
     * @param userId The ID of the user
     * @param status The follow status ("interested", "going", "not_going")
     * @return true if successful, false otherwise
     */
    public boolean followEvent(int eventId, int userId, String status) {
        String sql = "INSERT INTO event_followers (event_id, user_id, status) VALUES (?, ?, ?) "
                + "ON DUPLICATE KEY UPDATE status = ?";
        
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, eventId);
            st.setInt(2, userId);
            st.setString(3, status);
            st.setString(4, status);
            
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("Error following event: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Removes a user's follow status for an event
     * @param eventId The ID of the event
     * @param userId The ID of the user
     * @return true if successful, false otherwise
     */
    public boolean unfollowEvent(int eventId, int userId) {
        String sql = "DELETE FROM event_followers WHERE event_id = ? AND user_id = ?";
        
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, eventId);
            st.setInt(2, userId);
            
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            System.out.println("Error unfollowing event: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Gets all followers for a specific event
     * @param eventId The ID of the event
     * @return List of EventFollower objects
     */
    public List<EventFollower> getEventFollowers(int eventId) {
        String sql = "SELECT * FROM event_followers WHERE event_id = ?";
        List<EventFollower> followers = new ArrayList<>();
        
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, eventId);
            ResultSet rs = st.executeQuery();
            
            while (rs.next()) {
                EventFollower follower = new EventFollower();
                follower.setEventId(rs.getInt("event_id"));
                follower.setUserId(rs.getInt("user_id"));
                follower.setStatus(rs.getString("status"));
                follower.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                followers.add(follower);
            }
        } catch (SQLException e) {
            System.out.println("Error getting event followers: " + e.getMessage());
        }
        
        return followers;
    }
    
    /**
     * Gets an event with its follower statistics
     * Includes total follower count and counts by status (going/interested)
     * @param eventId The ID of the event
     * @return Event object with follower information, or null if not found
     */
    public Event getEventWithFollowers(int eventId) {
        String sql = "SELECT e.*, " +
                    "COUNT(DISTINCT ef.user_id) as follower_count, " +
                    "COUNT(CASE WHEN ef.status = 'going' THEN 1 END) as going_count, " +
                    "COUNT(CASE WHEN ef.status = 'interested' THEN 1 END) as interested_count " +
                    "FROM events e " +
                    "LEFT JOIN event_followers ef ON e.event_id = ef.event_id " +
                    "WHERE e.event_id = ? " +
                    "GROUP BY e.event_id";
        
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, eventId);
            ResultSet rs = st.executeQuery();
            
            if (rs.next()) {
                Event event = new Event();
                // Set basic event information
                event.setEventId(rs.getInt("event_id"));
                event.setTitle(rs.getString("title"));
                event.setDescription(rs.getString("description"));
                event.setStartTime(rs.getTimestamp("start_time").toLocalDateTime());
                event.setEndTime(rs.getTimestamp("end_time").toLocalDateTime());
                event.setLocation(rs.getString("location"));
                event.setCreatorId(rs.getInt("creator_id"));
                event.setImageUrl(rs.getString("image_url"));
                event.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
                event.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
                
                // Set follower statistics
                event.setFollowerCount(rs.getInt("follower_count"));
                event.setGoingCount(rs.getInt("going_count"));
                event.setInterestedCount(rs.getInt("interested_count"));
                
                // Get detailed follower information
                event.setFollowers(getEventFollowers(eventId));
                
                return event;
            }
        } catch (SQLException e) {
            System.out.println("Error getting event with followers: " + e.getMessage());
        }
        
        return null;
    }
} 