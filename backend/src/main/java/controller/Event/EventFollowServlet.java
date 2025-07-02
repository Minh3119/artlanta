package controller.Event;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dal.EventDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import model.Event;
import util.JsonUtil;
import util.SessionUtil;

/**
 * Servlet handling event follow/unfollow operations
 * Endpoint: /api/events/follow
 * Methods: POST (follow), DELETE (unfollow)
 * 
 * POST Request body should be JSON with:
 * - eventId: number (required)
 * - userId: number (required)
 * - status: string (required) - one of: "interested", "going", "not_going"
 * 
 * DELETE Request parameters:
 * - eventId: number (required)
 * - userId: number (required)
 * 
 * Both methods return the updated event object with current follower statistics
 */
@WebServlet(name = "EventFollowServlet", urlPatterns = {"/api/event/follow"})
public class EventFollowServlet extends HttpServlet {
    // Dependencies
    private final EventDAO eventDAO;
    private final Gson gson;
    
    /**
     * Constructor - initializes dependencies
     */
    public EventFollowServlet() {
        this.eventDAO = new EventDAO();
        this.gson = JsonUtil.getGson();
    }
    
    /**
     * Handles POST requests for following an event or updating follow status
     * 
     * Steps:
     * 1. Parses request body for event ID, user ID, and status
     * 2. Updates follow status in database
     * 3. Returns updated event data with new follower statistics
     * 
     * @param request The HTTP request
     * @param response The HTTP response
     * @throws ServletException If a servlet error occurs
     * @throws IOException If an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String status = "interested";
        try {
            JsonObject body = gson.fromJson(request.getReader(), JsonObject.class);
            int eventId = body.get("eventId").getAsInt();
            Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
            if (userId == null && body.has("userId")) {
                userId = body.get("userId").getAsInt();
            }
            if (userId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Only logged in users can use this\"}");
                return;
            }
            boolean success = eventDAO.followEvent(eventId, userId, status);
            if (success) {
                Event event = eventDAO.getEventWithFollowers(eventId);
                JsonObject resp = new JsonObject();
                resp.addProperty("success", true);
                resp.add("event", gson.toJsonTree(event));
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(gson.toJson(resp));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"success\": false, \"error\": \"Failed to update event status\"}");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        }
    }
    
    /**
     * Handles DELETE requests for unfollowing an event
     * 
     * Steps:
     * 1. Gets event ID and user ID from query parameters
     * 2. Removes follow status from database
     * 3. Returns updated event data with new follower statistics
     * 
     * @param request The HTTP request
     * @param response The HTTP response
     * @throws ServletException If a servlet error occurs
     * @throws IOException If an I/O error occurs
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            // Get parameters from query string
            int eventId = Integer.parseInt(request.getParameter("eventId"));
            int userId = Integer.parseInt(request.getParameter("userId"));
            
            // Remove follow status
            boolean success = eventDAO.unfollowEvent(eventId, userId);
            
            // Send response
            if (success) {
                // Get updated event data with new follower counts
                Event event = eventDAO.getEventWithFollowers(eventId);
                response.setStatus(HttpServletResponse.SC_OK);
                response.getWriter().write(gson.toJson(event));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Failed to unfollow event\"}");
            }
            
        } catch (Exception e) {
            // Handle any errors
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}