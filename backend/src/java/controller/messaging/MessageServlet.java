package controller.messaging;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import service.MessagingService;
import util.SessionUtil;
import util.JsonUtil;
import org.json.JSONObject;
import java.io.IOException;

@WebServlet("/api/messages")
public class MessageServlet extends HttpServlet {
    private final MessagingService messagingService = new MessagingService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        // Check if user is logged in
        HttpSession session = request.getSession(false);
        if (!SessionUtil.isLoggedIn(session)) {
            JsonUtil.writeJsonError(response, "User not logged in", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // Get conversation ID from query parameters
        String conversationIdStr = request.getParameter("conversationId");
        if (conversationIdStr == null || conversationIdStr.isEmpty()) {
            JsonUtil.writeJsonError(response, "Missing conversationId parameter", 
                HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        try {
            int conversationId = Integer.parseInt(conversationIdStr);
            
            // Verify the current user is part of the conversation
            // int currentUserId = SessionUtil.getCurrentUserId(session);
            // if (!messagingService.isUserInConversation(currentUserId, conversationId)) {
            //     JsonUtil.writeJsonError(response, "Not authorized to view this conversation", 
            //         HttpServletResponse.SC_FORBIDDEN);
            //     return;
            // }

            JSONObject jsonResponse = messagingService.getMessagesByConversationId(conversationId);
            
            // Send response
            JsonUtil.writeJsonResponse(response, jsonResponse);
            
        } catch (NumberFormatException e) {
            JsonUtil.writeJsonError(response, "Invalid conversation ID format", 
                HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "Error retrieving messages: " + e.getMessage(), 
                HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void destroy() {
        super.destroy();
        try {
            messagingService.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}