package controller.messaging;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.UserConversation;
import service.MessagingService;
import util.JsonUtil;
import util.SessionUtil;
import org.json.JSONArray;
import org.json.JSONObject;

import dto.ConversationDTO;

@WebServlet("/api/conversations")
public class ConversationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private final transient MessagingService messagingService;

    public ConversationServlet() {
        this.messagingService = new MessagingService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            // Get current user ID from session
            HttpSession session = request.getSession(false);
            if (session == null) {
                JsonUtil.writeJsonError(response, "Not authenticated", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            Integer userId = SessionUtil.getCurrentUserId(session);
            if (userId == null) {
                JsonUtil.writeJsonError(response, "User not found in session", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Get conversation type from request parameter (default to 'chat' if not specified)
            String typeParam = request.getParameter("type");
            UserConversation.ConversationType type = UserConversation.ConversationType.fromString(typeParam);
            
            // Get conversations based on type
            List<ConversationDTO> conversations;
            switch (type) {
                case PENDING:
                    conversations = messagingService.getPendingConversations(userId);
                    break;
                case ARCHIVED:
                    conversations = messagingService.getArchivedConversations(userId);
                    break;
                case CHAT:
                default:
                    conversations = messagingService.getChatConversations(userId);
                    break;
            }
            
            // Convert conversations to JSON
            JSONArray conversationsJson = messagingService.buildConversationsJson(conversations, userId, request);
            
            // Build and send response
            JSONObject responseJson = new JSONObject();
            responseJson.put("success", true);
            responseJson.put("type", type.getValue());
            responseJson.put("conversations", conversationsJson);
            JsonUtil.writeJsonResponse(response, responseJson);
            
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "An error occurred while fetching conversations: " + e.getMessage(), 
                                 HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Handles POST /api/conversations to create (or fetch existing) conversation between
     * the current authenticated user and the specified recipient. The request can pass
     * the recipient ID via form-urlencoded parameter `recipientId` or JSON body.
     * Responds with JSON { success: true, conversationId }
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Validate session and get current user
            HttpSession session = request.getSession(false);
            if (session == null) {
                JsonUtil.writeJsonError(response, "Not authenticated", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
            Integer currentUserId = SessionUtil.getCurrentUserId(session);
            if (currentUserId == null) {
                JsonUtil.writeJsonError(response, "User not found in session", HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            // Extract recipientId from request
            String recipientStr = request.getParameter("recipientId");
            if (recipientStr == null || recipientStr.isEmpty()) {
                // Try JSON body
                JSONObject bodyJson = JsonUtil.parseRequestBody(request);
                if (bodyJson != null && bodyJson.has("recipientId")) {
                    recipientStr = bodyJson.get("recipientId").toString();
                }
            }

            if (recipientStr == null || recipientStr.isEmpty()) {
                JsonUtil.writeJsonError(response, "Recipient ID is required", HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            int recipientId;
            try {
                recipientId = Integer.parseInt(recipientStr);
            } catch (NumberFormatException ex) {
                JsonUtil.writeJsonError(response, "Invalid recipient ID", HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            if (recipientId == currentUserId) {
                JsonUtil.writeJsonError(response, "Cannot create conversation with yourself", HttpServletResponse.SC_BAD_REQUEST);
                return;
            }

            // Create or get conversation
            int conversationId = messagingService.getOrCreateConversation(currentUserId, recipientId);
            if (conversationId <= 0) {
                JsonUtil.writeJsonError(response, "Failed to create conversation", HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }

            // Build success response
            JSONObject resJson = new JSONObject();
            resJson.put("success", true);
            resJson.put("conversationId", conversationId);
            JsonUtil.writeJsonResponse(response, resJson);

        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "An error occurred while creating conversation: " + e.getMessage(),
                    HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }


}
