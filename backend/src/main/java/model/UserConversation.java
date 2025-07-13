package model;

import java.sql.Timestamp;

/**
 * Represents a user's view of a conversation in the messaging system.
 * Combines conversation details with user-specific conversation settings.
 */
public class UserConversation {
    // User-specific conversation properties
    private int userId;
    private int conversationId;
    private ConversationType type;
    
    // Conversation properties
    private int user1Id;
    private int user2Id;
    private Timestamp createdAt;

    /**
     * Enum representing the possible types of user conversations
     */
    public enum ConversationType {
        CHAT("chat"),
        PENDING("pending"),
        ARCHIVED("archived");

        private final String value;

        ConversationType(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }

        public static ConversationType fromString(String value) {
            if (value != null) {
                for (ConversationType type : ConversationType.values()) {
                    if (value.equalsIgnoreCase(type.value)) {
                        return type;
                    }
                }
            }
            return CHAT; // Default to CHAT if not found
        }
    }

    // Constructors
    public UserConversation() {
        // Default constructor
    }

    /**
     * Creates a new UserConversation with minimal information
     */
    public UserConversation(int userId, int conversationId, ConversationType type) {
        this.userId = userId;
        this.conversationId = conversationId;
        this.type = type != null ? type : ConversationType.CHAT;
    }
    
    /**
     * Creates a complete UserConversation with all conversation details
     */
    public UserConversation(int userId, int conversationId, ConversationType type,
                           int user1Id, int user2Id, Timestamp createdAt) {
        this.userId = userId;
        this.conversationId = conversationId;
        this.type = type != null ? type : ConversationType.CHAT;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getConversationId() {
        return conversationId;
    }

    public void setConversationId(int conversationId) {
        this.conversationId = conversationId;
    }

    public ConversationType getType() {
        return type;
    }

    public void setType(ConversationType type) {
        this.type = type != null ? type : ConversationType.CHAT;
    }

    public void setType(String type) {
        this.type = ConversationType.fromString(type);
    }

    // Conversation property getters and setters
    public int getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(int user1Id) {
        this.user1Id = user1Id;
    }

    public int getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(int user2Id) {
        this.user2Id = user2Id;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
    
    /**
     * Gets the ID of the other user in this conversation
     * @param currentUserId The ID of the current user
     * @return The ID of the other user
     */
    public int getOtherUserId(int currentUserId) {
        return user1Id == currentUserId ? user2Id : user1Id;
    }
    
    /**
     * Checks if the given user ID is part of this conversation
     * @param userId The user ID to check
     * @return true if the user is part of this conversation, false otherwise
     */
    public boolean hasUser(int userId) {
        return this.user1Id == userId || this.user2Id == userId;
    }

    @Override
    public String toString() {
        return "UserConversation{" +
               "userId=" + userId +
               ", conversationId=" + conversationId +
               ", type=" + type +
               ", user1Id=" + user1Id +
               ", user2Id=" + user2Id +
               ", createdAt=" + createdAt +
               '}';
    }
}
