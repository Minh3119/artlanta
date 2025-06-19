package service;

import dal.ConversationDAO;
import dal.ConversationReadsDAO;
import dal.MessageDAO;
import dal.UserDAO;
import dto.ConversationDTO;
import model.Conversation;
import model.Message;
import model.User;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class MessagingService {
    private final ConversationDAO conversationDAO;
    private final UserDAO userDAO;
    private final MessageDAO messageDAO;
    private final UserService userService;
    private final ConversationReadsDAO conversationReadsDAO;

    public MessagingService() {
        this.conversationDAO = new ConversationDAO();
        this.userDAO = new UserDAO();
        this.messageDAO = new MessageDAO();
        this.userService = new UserService();
        this.conversationReadsDAO = new ConversationReadsDAO();
    }

    /**
     * Get all conversations for a user with user details and latest message
     * @param userId The ID of the user
     * @return List of ConversationListDTO containing conversation details
     */
    public List<ConversationDTO> getUserConversations(int userId) {
        List<ConversationDTO> result = new ArrayList<>();
        
        try {
            // Get all conversations for the user
            List<Conversation> conversations = conversationDAO.getConversationsByUserId(userId);
            
            // For each conversation, get the other user and latest message
            for (Conversation conversation : conversations) {
                // Determine the other user in the conversation
                int otherUserId = conversation.getUser1Id() == userId ? 
                                 conversation.getUser2Id() : conversation.getUser1Id();
                
                // Get other user's details
                User otherUser = userDAO.getOne(otherUserId);
                
                // Get the latest message in the conversation
                Message latestMessage = messageDAO.getLatestMessageByConversationId(conversation.getId());
                
                // Create and add DTO to the result list with only the other user
                result.add(new ConversationDTO(
                    conversation,
                    otherUser,
                    latestMessage
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            // In a real application, you might want to log this error
        }
        
        return result;
    }

    public JSONObject getMessagesByConversationId(int conversationId) {
        List<Message> messages = messageDAO.getMessagesByConversationId(conversationId);
        
        // Mark messages as read
        // messagingService.markMessagesAsRead(conversationId, currentUserId);
        
        // Convert messages to JSON
        JSONObject jsonResponse = new JSONObject();
        JSONArray messagesArray = new JSONArray();
        
        for (Message message : messages) {
            JSONObject messageJson = new JSONObject();
            messageJson.put("id", message.getId());
            messageJson.put("conversationId", message.getConversationId());
            messageJson.put("senderId", message.getSenderId());
            messageJson.put("content", message.getContent());
            messageJson.put("mediaUrl", message.getMediaUrl());
            messageJson.put("createdAt", message.getCreatedAt().toString());
            messagesArray.put(messageJson);
        }
        
        jsonResponse.put("success", true);
        jsonResponse.put("messages", messagesArray);

        return jsonResponse;
    }

    public Message createMessage(int conversationId, int senderId, String content, String mediaUrl) {
        Message message = new Message(-1, conversationId, senderId, content, mediaUrl, null, false, null);
        return messageDAO.create(message);
    }

    public Message createMessage(Message newMessage) {
        return messageDAO.create(newMessage);
    }
    
    /**
     * Get or create a conversation between two users
     * @param user1Id First user ID
     * @param user2Id Second user ID
     * @return The conversation ID
     */
    public int getOrCreateConversation(int user1Id, int user2Id) {
        // Check if conversation already exists
        Conversation existing = conversationDAO.getConversationBetweenUsers(user1Id, user2Id);
        if (existing != null) {
            return existing.getId();
        }
        
        // Create new conversation
        return conversationDAO.createConversation(user1Id, user2Id);
    }
    
    /**
     * Builds a JSON array of conversations with user details and latest message
     * @param conversations List of conversation DTOs
     * @param currentUserId ID of the current user
     * @return JSONArray containing conversation data
     */
    public JSONArray buildConversationsJson(List<dto.ConversationDTO> conversations, int currentUserId) {
        JSONArray conversationsJson = new JSONArray();
        
        if (conversations == null || conversations.isEmpty()) {
            return conversationsJson;
        }
        
        for (dto.ConversationDTO conversation : conversations) {
            try {
                JSONObject convJson = new JSONObject();
                
                convJson.put("id", conversation.getConversation().getId());
                convJson.put("createdAt", conversation.getConversation().getCreatedAt());
                
                model.User otherUser = conversation.getOtherUser();
                
                if (otherUser != null) {
                    JSONObject otherUserJson = userService.convertUserToJson(otherUser);
                    convJson.put("user", otherUserJson);
                }
                
                // Add latest message if exists
                if (conversation.getLatestMessage() != null) {
                    convJson.put("latestMessage", buildMessageJson(conversation.getLatestMessage(), currentUserId));
                }
                
                conversationsJson.put(convJson);
                
            } catch (Exception e) {
                // Log the error but continue processing other conversations
                System.err.println("Error processing conversation: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        return conversationsJson;
    }
    
    /**
     * Builds a JSON object for a message
     * @param message The message to convert to JSON
     * @return JSONObject containing message data
     */
    /**
     * Builds a JSON object for a message with read status
     * @param message The message to convert to JSON
     * @param currentUserId The ID of the current user (to check read status)
     * @return JSONObject containing message data with read status
     */
    private JSONObject buildMessageJson(model.Message message, int currentUserId) {
        JSONObject messageJson = new JSONObject();
        if (message != null) {
            messageJson.put("id", message.getId());
            messageJson.put("content", message.getContent());
            messageJson.put("mediaUrl", message.getMediaUrl());
            messageJson.put("createdAt", message.getCreatedAt());
            
            // Check if the message is read by the current user
            boolean isRead = isMessageReadByUser(message.getId(), currentUserId);
            messageJson.put("isRead", isRead);
            
            messageJson.put("senderId", message.getSenderId());
        }
        return messageJson;
    }
    
    /**
     * Check if a message is read by a user
     * @param messageId The message ID to check
     * @param userId The user ID to check
     * @return true if the message is read by the user, false otherwise
     */
    private boolean isMessageReadByUser(int messageId, int userId) {
        try {
            // Get the conversation ID for the message
            // Note: You might need to implement a method in MessageDAO to get conversation ID by message ID
            // For now, we'll assume the message object has a getConversationId() method
            // This is a simplified implementation - you'll need to adjust based on your actual data model
            
            // Get the last read message ID for this user in the conversation
            Message message = messageDAO.getById(messageId);
            if (message != null) {
                Integer lastReadMessageId = conversationReadsDAO.getLastReadMessageId(
                    message.getConversationId(), userId);
                
                // If the user has read messages in this conversation and the current message ID
                // is less than or equal to the last read message ID, then it's read
                return lastReadMessageId != null && messageId <= lastReadMessageId;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * Mark a message as read by a user
     * @param messageId The message ID to mark as read
     * @param userId The user ID who read the message
     * @return true if the operation was successful, false otherwise
     */
    public boolean markMessageAsRead(int messageId, int userId) {
        try {
            Message message = messageDAO.getById(messageId);
            if (message != null) {
                return conversationReadsDAO.updateLastReadMessage(
                    message.getConversationId(), userId, messageId);
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    /**
     * Soft delete a message if it belongs to the specified user.
     *
     * @param messageId  ID of the message to delete.
     * @param userId     ID of the user requesting deletion.
     * @return true if the message was deleted, false if not permitted or not found.
     */
    public boolean deleteMessage(int messageId, int userId) {
        try {
            Message message = messageDAO.getById(messageId);
            if (message == null) {
                return false; // message does not exist
            }
            if (message.getSenderId() != userId) {
                return false; // user not authorized to delete this message
            }
            return messageDAO.softDeleteById(messageId);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Get the other participant in a conversation (recipient) based on sender.
     * @param conversationId Conversation ID
     * @param senderId Sender user ID
     * @return recipient user ID, or -1 if not found
     */
    public int getRecipientId(int conversationId, int senderId) {
        Conversation conv = conversationDAO.getById(conversationId);
        if (conv == null) return -1;
        return conv.getUser1Id() == senderId ? conv.getUser2Id() : conv.getUser1Id();
    }

    public Message getMessageById(int messageId) {
        return messageDAO.getById(messageId);
    }

    /**
     * Close all DAO connections managed by this service.
     */
    public void close() {
        try {
            conversationDAO.closeConnection();
            userDAO.closeConnection();
            messageDAO.closeConnection();
            conversationReadsDAO.closeConnection();
            // Close nested service resources
            userService.closeConnection();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
