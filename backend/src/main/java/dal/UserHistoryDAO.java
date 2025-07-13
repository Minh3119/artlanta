package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.UserHistory;
import model.Post;
import model.User;

/**
 * Data Access Object for UserHistory-related database operations
 */
public class UserHistoryDAO extends DBContext {
    
    /**
     * Add a new history entry, removing any previous entry for the same post
     */
    public boolean addHistory(int userId, int postId, int artistId) {
        // First delete any existing history for this post and user
        String deleteSql = "DELETE FROM UserHistory WHERE UserID = ? AND PostID = ?";
        
        // Then insert the new history entry
        String insertSql = "INSERT INTO UserHistory (UserID, PostID, ArtistID) VALUES (?, ?, ?)";
        
        try(PreparedStatement insertStmt = connection.prepareStatement(insertSql)) {
            // Delete old entry if exists
            PreparedStatement deleteStmt = connection.prepareStatement(deleteSql);
            deleteStmt.setInt(1, userId);
            deleteStmt.setInt(2, postId);
            deleteStmt.executeUpdate();
            deleteStmt.close();
            
            // Insert new entry
            
            insertStmt.setInt(1, userId);
            insertStmt.setInt(2, postId);
            insertStmt.setInt(3, artistId);
            return insertStmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Get user's history with post and artist details
     */
    public List<UserHistory> getUserHistory(int userId, int limit) {
        List<UserHistory> history = new ArrayList<>();
        String sql = """
            SELECT h.*, p.Content as PostContent, p.CreatedAt as PostCreatedAt,
                   u.FullName as ArtistName, u.AvatarURL as ArtistAvatar
            FROM UserHistory h
            LEFT JOIN Posts p ON h.PostID = p.ID
            LEFT JOIN Users u ON h.ArtistID = u.ID
            WHERE h.UserID = ?
            ORDER BY h.ViewedAt DESC
            LIMIT ?
        """;
        
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            st.setInt(2, limit);
            ResultSet rs = st.executeQuery();
            
            while (rs.next()) {
                UserHistory entry = new UserHistory(
                    rs.getInt("ID"),
                    rs.getInt("UserID"),
                    rs.getInt("PostID"),
                    rs.getInt("ArtistID"),
                    rs.getTimestamp("ViewedAt")
                );
                history.add(entry);
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return history;
    }
    
    /**
     * Delete history entries older than specified days
     */
    public boolean deleteOldHistory(int days) {
        String sql = "DELETE FROM UserHistory WHERE ViewedAt < DATE_SUB(NOW(), INTERVAL ? DAY)";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, days);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Clear user's entire history
     */
    public boolean clearUserHistory(int userId) {
        String sql = "DELETE FROM UserHistory WHERE UserID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
} 