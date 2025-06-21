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
                        rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null,
                        rs.getBoolean("isDeleted"),
                        rs.getTimestamp("deletedAt") != null ? rs.getTimestamp("deletedAt").toLocalDateTime() : null
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    // Get all messages in a conversation
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
                        rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null,
                        rs.getBoolean("isDeleted"),
                        rs.getTimestamp("deletedAt") != null ? rs.getTimestamp("deletedAt").toLocalDateTime() : null
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
                        rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null,
                        rs.getBoolean("isDeleted"),
                        rs.getTimestamp("deletedAt") != null ? rs.getTimestamp("deletedAt").toLocalDateTime() : null
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Creates a new message in the database.
     * @param message The message object to create.
     * @return True if the message was created successfully, false otherwise.
     */
    public Message create(Message message) {
        String sql = "INSERT INTO Messages (ConversationID, SenderID, Content, MediaURL) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setInt(1, message.getConversationId());
            stmt.setInt(2, message.getSenderId());
            stmt.setString(3, message.getContent());
            stmt.setString(4, message.getMediaUrl());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows > 0) {
                try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        int id = generatedKeys.getInt(1);
                        return getById(id); // Retrieve the full message with timestamp
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * Soft delete a message by marking it as deleted and setting the deletedAt timestamp.
     *
     * @param messageId The ID of the message to delete.
     * @return true if at least one row was updated, false otherwise.
     */
    public boolean softDeleteById(int messageId) {
        String sql = "UPDATE Messages SET isDeleted = TRUE, deletedAt = CURRENT_TIMESTAMP WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, messageId);
            int affectedRows = stmt.executeUpdate();
            return affectedRows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

}
