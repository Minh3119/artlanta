package service;

import dal.ConversationDAO;
import dal.ConversationReadsDAO;
import dal.MessageDAO;
import dal.UserConversationDAO;
import dal.UserDAO;
import dto.ConversationDTO;
import model.Conversation;
import model.Message;
import model.User;
import model.UserConversation;
import model.json.SendMessagePayload;
import model.json.UnsendMessagePayload;
import util.JsonUtil;

import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonSyntaxException;

import java.util.ArrayList;
import java.util.List;

public class MessagingService {

    public static final int DEFAULT_LIMIT = 15;
    public static final int DEFAULT_OFFSET = 0;

    private UserService userService;
    public MessagingService() {
        userService = new UserService();
    }

    /**
     * Get all chat conversations for a user with user details and latest message
     * @param userId The ID of the user
     * @return List of ConversationDTO containing conversation details
     */
    public List<ConversationDTO> getChatConversations(int userId) {
        return getConversationsByType(userId, UserConversation.ConversationType.CHAT);
    }

    /**
     * Get all pending conversations for a user with user details and latest message
     * @param userId The ID of the user
     * @return List of ConversationDTO containing conversation details
     */
    public List<ConversationDTO> getPendingConversations(int userId) {
        return getConversationsByType(userId, UserConversation.ConversationType.PENDING);
    }

    /**
     * Get all archived conversations for a user with user details and latest message
     * @param userId The ID of the user
     * @return List of ConversationDTO containing conversation details
     */
    public List<ConversationDTO> getArchivedConversations(int userId) {
        return getConversationsByType(userId, UserConversation.ConversationType.ARCHIVED);
    }

    /**
     * Get all conversations of a specific type for a user with user details and latest message
     * @param userId The ID of the user
     * @param type The type of conversations to retrieve
     * @return List of ConversationDTO containing conversation details
     */
    private List<ConversationDTO> getConversationsByType(int userId, UserConversation.ConversationType type) {
        UserConversationDAO userConvDAO = new UserConversationDAO();
        UserDAO userDAO = new UserDAO();
        MessageDAO messageDAO = new MessageDAO();
        List<ConversationDTO> result = new ArrayList<>();
        
        try {
            // Get all conversations of the specified type for the user
            List<UserConversation> conversations = userConvDAO.getConversationsByType(userId, type);
            
            // For each conversation, get the other user and latest message
            for (UserConversation userConv : conversations) {
                // Get the other user in the conversation
                int otherUserId = userConv.getOtherUserId(userId);
                
                // Get other user's details
                User otherUser = userDAO.getOne(otherUserId);
                
                // Get the latest message in the conversation
                Message latestMessage = messageDAO.getLatestMessageByConversationId(userConv.getConversationId());
                
                // Create and add DTO to the result list
                result.add(new ConversationDTO(
                    new Conversation(
                        userConv.getConversationId(),
                        userConv.getUser1Id(),
                        userConv.getUser2Id(),
                        userConv.getCreatedAt()
                    ),
                    otherUser,
                    latestMessage
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
            // In a real application, you might want to log this error
        } finally {
            userConvDAO.closeConnection();
            userDAO.closeConnection();
            messageDAO.closeConnection();
        }
        
        return result;
    }
    
    /**
     * @deprecated Use getChatConversations() instead
     */
    @Deprecated
    public List<ConversationDTO> getUserConversations(int userId) {
        return getChatConversations(userId);
    }

    public boolean isUserInConversation(int userId, int conversationId) {
        ConversationDAO conversationDAO = new ConversationDAO();
        try {
            Conversation conversation = conversationDAO.getById(conversationId);
            if (conversation == null) return false;
            return conversation.getUser1Id() == userId || conversation.getUser2Id() == userId;
        } finally {
            if (conversationDAO != null) {
                conversationDAO.closeConnection();
            }
        }
    }

    // overload 1
    public JSONObject getMessagesByConversationId(int conversationId) {
        return getMessagesByConversationId(conversationId, DEFAULT_LIMIT, DEFAULT_OFFSET);
    }

    // overload 2
    public JSONObject getMessagesByConversationId(int conversationId, int offset) {
        return getMessagesByConversationId(conversationId, DEFAULT_LIMIT, offset);
    }

    // overload 3
    public JSONObject getMessagesByConversationId(int conversationId, int limit, int offset) {
        MessageDAO messageDAO = new MessageDAO();
        try {
            List<Message> messages = messageDAO.getMessagesByConversationId(conversationId, limit, offset);
            
            // Reverse the list (oldest first) for frontend display
            java.util.Collections.reverse(messages);
            
            // Convert messages to JSON
            JSONObject jsonResponse = new JSONObject();
            JSONArray messagesArray = new JSONArray(JsonUtil.toJsonString(messages));
            
            jsonResponse.put("success", true);
            jsonResponse.put("messages", messagesArray);

            return jsonResponse;
        } finally {
            if (messageDAO != null) {
                messageDAO.closeConnection();
            }
        }
    }

    public Message createMessage(int conversationId, int senderId, String content, String mediaUrl) {
        Message message = new Message(-1, conversationId, senderId, content, mediaUrl, null, false, null);
        return createMessage(message);
    }

    public Message createMessage(Message newMessage) {
        MessageDAO messageDAO = new MessageDAO();
        try {
            return messageDAO.create(newMessage);
        } finally {
            if (messageDAO != null) {
                messageDAO.closeConnection();
            }
        }
    }
    
    /**
     * Get or create a conversation between two users
     * @param user1Id First user ID
     * @param user2Id Second user ID
     * @return The conversation ID, or -1 if there was an error
     */
    public int getOrCreateConversation(int user1Id, int user2Id) {
        if (user1Id == user2Id) {
            return -1; // Cannot create a conversation with oneself
        }
        
        ConversationDAO conversationDAO = new ConversationDAO();
        UserConversationDAO userConversationDAO = new UserConversationDAO();
        
        try {
            // Check if conversation already exists
            Conversation existing = conversationDAO.getConversationBetweenUsers(user1Id, user2Id);
            if (existing != null) {
                return existing.getId();
            }
            
            // Create new conversation
            int conversationId = conversationDAO.createConversation(user1Id, user2Id);
            if (conversationId == -1) {
                return -1; // Failed to create conversation
            }
            
            // Create user conversation entries for both participants
            boolean success = userConversationDAO.updateConversationType(user1Id, conversationId, 
                    UserConversation.ConversationType.CHAT);
            
            if (success) {
                success = userConversationDAO.updateConversationType(user2Id, conversationId, 
                        UserConversation.ConversationType.CHAT);
            }
            
            if (!success) {
                // If we failed to create user conversation entries, clean up the conversation
                conversationDAO.delete(conversationId);
                return -1;
            }
            
            return conversationId;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        } finally {
            if (conversationDAO != null) {
                conversationDAO.closeConnection();
            }
            if (userConversationDAO != null) {
                userConversationDAO.closeConnection();
            }
        }
    }
    
    /**
     * Builds a JSON array of conversations with user details and latest message
     * @param conversations List of conversation DTOs
     * @param currentUserId ID of the current user
     * @return JSONArray containing conversation data
     */
    public JSONArray buildConversationsJson(List<ConversationDTO> conversations, int currentUserId) {
        JSONArray conversationsJson = new JSONArray();
        
        if (conversations == null || conversations.isEmpty()) {
            return conversationsJson;
        }
        
        for (ConversationDTO conversation : conversations) {
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
        MessageDAO messageDAO = new MessageDAO();
        ConversationReadsDAO conversationReadsDAO = new ConversationReadsDAO();
        try {
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
        } finally {
            if (messageDAO != null) {
                messageDAO.closeConnection();
            }
            if (conversationReadsDAO != null) {
                conversationReadsDAO.closeConnection();
            }
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
        } finally {
            if (messageDAO != null) {
                messageDAO.closeConnection();
            }
            if (conversationReadsDAO != null) {
                conversationReadsDAO.closeConnection();
            }
        }
    }
    
    /**
     * Soft delete a message if it belongs to the specified user.
     * @param messageId ID of the message to delete.
     * @param userId ID of the user requesting deletion.
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
        } finally {
            if (messageDAO != null) {
                messageDAO.closeConnection();
            }
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
        try {
            Conversation conv = conversationDAO.getById(conversationId);
            if (conv == null) return -1;
            return conv.getUser1Id() == senderId ? conv.getUser2Id() : conv.getUser1Id();
        } finally {
            if (conversationDAO != null) {
                conversationDAO.closeConnection();
            }
        }
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
            return JsonUtil.toJsonString(response);
        } catch (JsonSyntaxException e) {
            System.out.println("Failed to parse JSON");
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    
    public JSONObject handleUnsendMessage(UnsendMessagePayload payload) {
        MessageDAO messageDAO = new MessageDAO();
        try {
            // 1. Get message first to get conversation ID
            Message message = messageDAO.getById(payload.getMessageId());
            if (message == null) {
                throw new Exception("Message not found");
            }
            
            // 2. Delete message in database
            boolean success = deleteMessage(payload.getMessageId(), payload.getCurrentUserId());
            if (!success) {
                throw new Exception("Failed to delete message");
            }

            // 3. Create response
            JSONObject response = new JSONObject();
            response.put("action", "unsend");
            response.put("messageId", payload.getMessageId());
            response.put("conversationId", message.getConversationId());
            return response;
        } catch (JsonSyntaxException e) {
            System.out.println("Failed to parse JSON");
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (messageDAO != null) {
                messageDAO.closeConnection();
            }
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
