package service;

import dal.ConversationDAO;
import dal.ConversationReadsDAO;
import dal.MessageDAO;
import dal.UserDAO;
import dto.ConversationDTO;
import model.Conversation;
import model.Message;
import model.User;
import model.json.SendMessagePayload;
import model.json.UnsendMessagePayload;
import util.JsonUtil;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonSyntaxException;

import java.util.ArrayList;
import java.util.List;

public class MessagingService {

    private UserService userService;
    public MessagingService() {
        userService = new UserService();
    }

    /**
     * Get all conversations for a user with user details and latest message
     * @param userId The ID of the user
     * @return List of ConversationListDTO containing conversation details
     */
    public List<ConversationDTO> getUserConversations(int userId) {
        ConversationDAO conversationDAO = new ConversationDAO();
        UserDAO userDAO = new UserDAO();
        MessageDAO messageDAO = new MessageDAO();
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
        
        conversationDAO.closeConnection();
        userDAO.closeConnection();
        messageDAO.closeConnection();
        return result;
    }

    public boolean isUserInConversation(int userId, int conversationId) {
        ConversationDAO conversationDAO = new ConversationDAO();
        Conversation conversation = conversationDAO.getById(conversationId);
        if (conversation == null) return false;
        return conversation.getUser1Id() == userId || conversation.getUser2Id() == userId;
    }

    public JSONObject getMessagesByConversationId(int conversationId) {
        MessageDAO messageDAO = new MessageDAO();
        List<Message> messages = messageDAO.getMessagesByConversationId(conversationId);
        
        // Convert messages to JSON
        JSONObject jsonResponse = new JSONObject();
        JSONArray messagesArray = new JSONArray(JsonUtil.toJsonString(messages));
        
        // for (Message message : messages) {
        //     JSONObject messageJson = new JSONObject();
        //     messageJson.put("id", message.getId());
        //     messageJson.put("conversationId", message.getConversationId());
        //     messageJson.put("senderId", message.getSenderId());
        //     messageJson.put("content", message.getContent());
        //     messageJson.put("mediaUrl", message.getMediaUrl());
        //     messageJson.put("createdAt", message.getCreatedAt().toString());
        //     messagesArray.put(messageJson);
        // }
        
        jsonResponse.put("success", true);
        jsonResponse.put("messages", messagesArray);

        return jsonResponse;
    }

    public Message createMessage(int conversationId, int senderId, String content, String mediaUrl) {
        MessageDAO messageDAO = new MessageDAO();
        Message message = new Message(-1, conversationId, senderId, content, mediaUrl, null, false, null);
        return messageDAO.create(message);
    }

    public Message createMessage(Message newMessage) {
        MessageDAO messageDAO = new MessageDAO();
        return messageDAO.create(newMessage);
    }
    
    /**
     * Get or create a conversation between two users
     * @param user1Id First user ID
     * @param user2Id Second user ID
     * @return The conversation ID
     */
    public int getOrCreateConversation(int user1Id, int user2Id) {
        ConversationDAO conversationDAO = new ConversationDAO();
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
                Message m = conversation.getLatestMessage();
                if (m != null) {
                    JSONObject messageJson = new JSONObject(m);
                    boolean isRead = isMessageReadByUser(m.getId(), currentUserId);
                    messageJson.put("isRead", isRead);
                    convJson.put("latestMessage", messageJson);
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
     * Check if a message is read by a user
     * @param messageId The message ID to check
     * @param userId The user ID to check
     * @return true if the message is read by the user, false otherwise
     */
    private boolean isMessageReadByUser(int messageId, int userId) {
        try {
            MessageDAO messageDAO = new MessageDAO();
            ConversationReadsDAO conversationReadsDAO = new ConversationReadsDAO();
            
            // Get the 'last read message ID' for this user in the conversation
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
        MessageDAO messageDAO = new MessageDAO();
        ConversationReadsDAO conversationReadsDAO = new ConversationReadsDAO();
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
        MessageDAO messageDAO = new MessageDAO();
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
        ConversationDAO conversationDAO = new ConversationDAO();
        Conversation conv = conversationDAO.getById(conversationId);
        if (conv == null) return -1;
        return conv.getUser1Id() == senderId ? conv.getUser2Id() : conv.getUser1Id();
    }

    public String handleSendMessage(SendMessagePayload payload) {
        try {
            // 1. INSERT new Message in Database (persisted message)
            String text = payload.getContent() != null ? payload.getContent().getText() : null;
            Message toCreate = new Message(
                -1, 
                payload.getConversationId(), 
                payload.getSenderId(), 
                text, 
                payload.getContent().getMedia() != null ? payload.getContent().getMedia().getUrl() : null, 
                null, // leave this null for MessageDAO to handle
                false, 
                null);
            Message newMessage = createMessage(toCreate);

            if (newMessage == null) {
                throw new Exception("Failed to create message.");
            }

            // 2. Convert the persisted message to JSON
            SendMessageResponse response = new SendMessageResponse();
            response.setAction("send");
            response.setMessage(newMessage);
            String responseJsonString = JsonUtil.toJsonString(response);
            return responseJsonString;
        } catch (JsonSyntaxException e) {
            System.out.println("Failed to parse JSON");
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public JSONObject handleUnsendMessage(UnsendMessagePayload payload) {
        try {
            // 1. Delete message in database
            boolean success = deleteMessage(payload.getMessageId(), payload.getCurrentUserId());
            if (!success) throw new Exception("Failed to delete message.");

            // 2. Convert the deleted message to JSON
            Message deleted = new MessageDAO().getById(payload.getMessageId());
            JSONObject response = new JSONObject();
            response.put("action", "unsend");
            response.put("messageId", payload.getMessageId());
            response.put("conversationId", deleted.getConversationId());
            return response;
        } catch (JsonSyntaxException e) {
            System.out.println("Failed to parse JSON");
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}

class SendMessageResponse {
    private String action;
    private Message message;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Message getMessage() { return message; }
    public void setMessage(Message message) { this.message = message; }
}
