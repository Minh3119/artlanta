package dal;

import java.sql.*;

public class ConversationReadsDAO extends DBContext {
    
    /**
     * Get the last read message ID for a user in a conversation
     * @param conversationId The conversation ID
     * @param userId The user ID
     * @return The ID of the last read message, or null if not found
     */
    public Integer getLastReadMessageId(int conversationId, int userId) {
        String sql = "SELECT LastReadMessageID FROM ConversationReads WHERE ConversationID = ? AND UserID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, conversationId);
            stmt.setInt(2, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("LastReadMessageID");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    /**
     * Update the last read message for a user in a conversation
     * @param conversationId The conversation ID
     * @param userId The user ID
     * @param messageId The ID of the last read message
     * @return true if the update was successful, false otherwise
     */
    public boolean updateLastReadMessage(int conversationId, int userId, int messageId) {
        String sql = "INSERT INTO ConversationReads (ConversationID, UserID, LastReadMessageID) " +
                    "VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE LastReadMessageID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, conversationId);
            stmt.setInt(2, userId);
            stmt.setInt(3, messageId);
            stmt.setInt(4, messageId);
            
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}
