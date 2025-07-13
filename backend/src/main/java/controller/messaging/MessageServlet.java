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
import util.Formatter;

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
            JsonUtil.writeJsonError(response, "Missing conversationId parameter", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        
        // Get offset from query parameters
        String offsetStr = request.getParameter("offset");
        if (offsetStr == null || offsetStr.isEmpty()) {
            JsonUtil.writeJsonError(response, "Missing offset parameter", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        int conversationId = Formatter.getPositiveInt(conversationIdStr);
        if (conversationId < 0) {
            JsonUtil.writeJsonError(response, "Invalid conversation ID format", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        int offset = Formatter.getPositiveInt(offsetStr);
        if (offset < 0) {
            JsonUtil.writeJsonError(response, "Invalid offset format", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Verify the current user is part of the conversation
        int currentUserId = SessionUtil.getCurrentUserId(session);
        if (!messagingService.isUserInConversation(currentUserId, conversationId)) {
            JsonUtil.writeJsonError(response, "Not authorized to view this conversation", HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        // Respond
        JSONObject jsonResponse = messagingService.getMessagesByConversationId(conversationId, offset);
        JsonUtil.writeJsonResponse(response, jsonResponse);
    }

}