package dal;

import model.Message;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MessageDAO extends DBContext {
    
    // Get the latest message in a conversation
    public Message getLatestMessageByConversationId(int conversationId) {
        String sql = "SELECT * FROM Messages WHERE ConversationID = ? ORDER BY CreatedAt DESC LIMIT 1";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, conversationId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Message(
                        rs.getInt("ID"),
                        rs.getInt("ConversationID"),
                        rs.getInt("SenderID"),
                        rs.getString("Content"),
                        rs.getString("MediaURL"),
                        rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Get all messages in a conversation (if needed later)
    public List<Message> getMessagesByConversationId(int conversationId) {
        List<Message> messages = new ArrayList<>();
        String sql = "SELECT * FROM Messages WHERE ConversationID = ? ORDER BY CreatedAt ASC";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, conversationId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    messages.add(new Message(
                        rs.getInt("ID"),
                        rs.getInt("ConversationID"),
                        rs.getInt("SenderID"),
                        rs.getString("Content"),
                        rs.getString("MediaURL"),
                        rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null
                    ));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return messages;
    }
    
    /**
     * Get a message by its ID
     * @param messageId The ID of the message to retrieve
     * @return The Message object, or null if not found
     */
    public Message getById(int messageId) {
        String sql = "SELECT * FROM Messages WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, messageId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Message(
                        rs.getInt("ID"),
                        rs.getInt("ConversationID"),
                        rs.getInt("SenderID"),
                        rs.getString("Content"),
                        rs.getString("MediaURL"),
                        rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
