package controller.messaging;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import service.MessagingService;
import util.JsonUtil;
import util.SessionUtil;
import org.json.JSONArray;
import org.json.JSONObject;

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

            // Get conversations for the user and convert to JSON
            List<dto.ConversationDTO> conversations = messagingService.getUserConversations(userId);
            JSONArray conversationsJson = messagingService.buildConversationsJson(conversations, userId);
            
            // Build and send response
            JSONObject responseJson = new JSONObject();
            responseJson.put("success", true);
            responseJson.put("conversations", conversationsJson);
            JsonUtil.writeJsonResponse(response, responseJson);
            
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "An error occurred while fetching conversations: " + e.getMessage(), 
                                 HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
    

}
