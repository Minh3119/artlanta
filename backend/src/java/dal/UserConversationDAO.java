package dal;

import model.UserConversation;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for managing UserConversation entities.
 * Handles database operations related to user-specific conversation settings.
 */
public class UserConversationDAO extends DBContext {
    
    /**
     * Retrieves all conversations of a specific type for a user
     * @param userId The ID of the user
     * @param type The type of conversations to retrieve (can be null for all types)
     * @return List of UserConversation objects
     */
    public List<UserConversation> getConversationsByType(int userId, UserConversation.ConversationType type) {
        List<UserConversation> conversations = new ArrayList<>();
        StringBuilder sql = new StringBuilder("""
            SELECT uc.UserID, uc.ConversationID, uc.Type,
                   c.User1ID, c.User2ID, c.CreatedAt
            FROM UserConversations uc
            INNER JOIN Conversations c ON uc.ConversationID = c.ID
            WHERE uc.UserID = ?
        """);
        
        if (type != null) {
            sql.append(" AND uc.Type = ?");
        }
        sql.append(" ORDER BY c.CreatedAt DESC");
        
        try (PreparedStatement stmt = connection.prepareStatement(sql.toString())) {
            stmt.setInt(1, userId);
            if (type != null) {
                stmt.setString(2, type.getValue());
            }
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    conversations.add(mapResultSetToUserConversation(rs));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conversations;
    }
    
    /**
     * Gets all chat conversations for a user
     */
    public List<UserConversation> getChatConversations(int userId) {
        return getConversationsByType(userId, UserConversation.ConversationType.CHAT);
    }
    
    /**
     * Gets all pending conversations for a user
     */
    public List<UserConversation> getPendingConversations(int userId) {
        return getConversationsByType(userId, UserConversation.ConversationType.PENDING);
    }
    
    /**
     * Gets all archived conversations for a user
     */
    public List<UserConversation> getArchivedConversations(int userId) {
        return getConversationsByType(userId, UserConversation.ConversationType.ARCHIVED);
    }
    
    /**
     * Updates the type of a user's conversation
     * @param userId The ID of the user
     * @param conversationId The ID of the conversation
     * @param newType The new conversation type
     * @return true if the update was successful, false otherwise
     */
    public boolean updateConversationType(int userId, int conversationId, UserConversation.ConversationType newType) {
        String sql = """
            INSERT INTO UserConversations (UserID, ConversationID, Type) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE Type = ?
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, conversationId);
            stmt.setString(3, newType.getValue());
            stmt.setString(4, newType.getValue());
            
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Gets a specific user conversation
     * @param userId The ID of the user
     * @param conversationId The ID of the conversation
     * @return The UserConversation object, or null if not found
     */
    public UserConversation getUserConversation(int userId, int conversationId) {
        String sql = """
            SELECT uc.UserID, uc.ConversationID, uc.Type,
                   c.User1ID, c.User2ID, c.CreatedAt
            FROM UserConversations uc
            INNER JOIN Conversations c ON uc.ConversationID = c.ID
            WHERE uc.UserID = ? AND uc.ConversationID = ?
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, conversationId);
            
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUserConversation(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    /**
     * Maps a ResultSet row to a UserConversation object
     */
    private UserConversation mapResultSetToUserConversation(ResultSet rs) throws SQLException {
        return new UserConversation(
            rs.getInt("UserID"),
            rs.getInt("ConversationID"),
            UserConversation.ConversationType.fromString(rs.getString("Type")),
            rs.getInt("User1ID"),
            rs.getInt("User2ID"),
            rs.getTimestamp("CreatedAt")
        );
    }
}
