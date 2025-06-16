package service;

import dal.ConversationDAO;
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

    public MessagingService() {
        this.conversationDAO = new ConversationDAO();
        this.userDAO = new UserDAO();
        this.messageDAO = new MessageDAO();
        this.userService = new UserService();
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
                
                // Add conversation details
                convJson.put("id", conversation.getConversation().getId());
                convJson.put("createdAt", conversation.getConversation().getCreatedAt());
                
                // Get the other user from DTO
                model.User otherUser = conversation.getOtherUser();
                
                // Add other user details only
                if (otherUser != null) {
                    JSONObject otherUserJson = userService.convertUserToJson(otherUser);
                    convJson.put("user", otherUserJson);
                }
                
                // Add latest message if exists
                if (conversation.getLatestMessage() != null) {
                    convJson.put("latestMessage", buildMessageJson(conversation.getLatestMessage()));
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
    private JSONObject buildMessageJson(model.Message message) {
        JSONObject messageJson = new JSONObject();
        if (message != null) {
            messageJson.put("id", message.getId());
            messageJson.put("content", message.getContent());
            messageJson.put("mediaUrl", message.getMediaUrl());
            messageJson.put("createdAt", message.getCreatedAt());
            messageJson.put("isRead", message.isRead());
            messageJson.put("senderId", message.getSenderId());
        }
        return messageJson;
    }
}
