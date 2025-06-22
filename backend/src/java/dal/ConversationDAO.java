package dal;

import model.Conversation;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ConversationDAO extends DBContext {
    
    // Get all conversations for a user
    public List<Conversation> getConversationsByUserId(int userId) {
        List<Conversation> conversations = new ArrayList<>();
        String sql = "SELECT * FROM Conversations WHERE User1ID = ? OR User2ID = ? ORDER BY CreatedAt DESC";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, userId);
            ResultSet rs = stmt.executeQuery();
            
            while (rs.next()) {
                Conversation conversation = new Conversation(
                    rs.getInt("ID"),
                    rs.getInt("User1ID"),
                    rs.getInt("User2ID"),
                    rs.getTimestamp("CreatedAt")
                );
                conversations.add(conversation);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return conversations;
    }
    
    // Get conversation between two users
    public Conversation getConversationBetweenUsers(int user1Id, int user2Id) {
        String sql = "SELECT * FROM Conversations WHERE (User1ID = ? AND User2ID = ?) OR (User1ID = ? AND User2ID = ?)";
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, user1Id);
            stmt.setInt(2, user2Id);
            stmt.setInt(3, user2Id);
            stmt.setInt(4, user1Id);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return new Conversation(
                    rs.getInt("ID"),
                    rs.getInt("User1ID"),
                    rs.getInt("User2ID"),
                    rs.getTimestamp("CreatedAt")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    
    // Create a new conversation
    public int createConversation(int user1Id, int user2Id) {
        String sql = "INSERT INTO Conversations (User1ID, User2ID) VALUES (?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            // Ensure user1Id is always the smaller ID to prevent duplicate conversations
            int firstUserId = Math.min(user1Id, user2Id);
            int secondUserId = Math.max(user1Id, user2Id);
            
            stmt.setInt(1, firstUserId);
            stmt.setInt(2, secondUserId);
            
            int affectedRows = stmt.executeUpdate();
            
            if (affectedRows == 0) {
                throw new SQLException("Creating conversation failed, no rows affected.");
            }
            
            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    return generatedKeys.getInt(1);
                } else {
                    throw new SQLException("Creating conversation failed, no ID obtained.");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return -1;
        }
    }

    // Get conversation by its ID
    public Conversation getById(int conversationId) {
        String sql = "SELECT * FROM Conversations WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, conversationId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Conversation(
                        rs.getInt("ID"),
                        rs.getInt("User1ID"),
                        rs.getInt("User2ID"),
                        rs.getTimestamp("CreatedAt")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}
