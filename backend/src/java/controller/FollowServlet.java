package controller;

// Required imports for database operations, models, and servlets
import dal.FollowDAO;
import dal.UserDAO;
import dal.NotificationDAO;
import model.Follow;
import model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import util.SessionUtil;

// Servlet mapping for follow-related API endpoints
@WebServlet("/api/follow")
public class FollowServlet extends HttpServlet {

    // Database access objects for follow and user operations
    private FollowDAO followDAO = new FollowDAO();
    private UserDAO userDAO = new UserDAO();
    private NotificationDAO notificationDAO = new NotificationDAO();

    // ==================== POST ENDPOINT ====================
    // Handles follow/unfollow actions
    @Override
    protected void doPost(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        // Authentication check
        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"Not logged in\"}");
            return;
        }

        // Process follow/unfollow action
        String action = request.getParameter("action");
        int targetId = Integer.parseInt(request.getParameter("targetId"));

        boolean result = false;
        if ("follow".equals(action)) {
            result = followDAO.follow(userId, targetId);
            
            // Add notification when follow is successful
            if (result) {
                // Get the follower's username
                User follower = userDAO.getOne(userId);
                if (follower != null) {
                    // Create notification for the person being followed
                    String notificationType = "follow";
                    String notificationContent = follower.getUsername() + " started following you";
                    notificationDAO.saveNotification(targetId, notificationType, notificationContent);
                }
            }
        } else if ("unfollow".equals(action)) {
            result = followDAO.unfollow(userId, targetId);
            
            // Add notification when unfollow is successful
            if (result) {
                // Get the unfollower's username
                User unfollower = userDAO.getOne(userId);
                if (unfollower != null) {
                    // Create notification for the person being unfollowed
                    String notificationType = "unfollow";
                    String notificationContent = unfollower.getUsername() + " unfollowed you";
                    notificationDAO.saveNotification(targetId, notificationType, notificationContent);
                }
            }
        }
        out.print("{\"success\":" + result + "}");
    }

    // ==================== GET ENDPOINT ====================
    // Handles various follow-related queries (list, count, status)
    @Override
    protected void doGet(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String type = request.getParameter("type");
        int targetUserId = Integer.parseInt(request.getParameter("userId"));

        // Get target user profile for privacy checks
        User targetUser = userDAO.getOne(targetUserId);
        if (targetUser == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"error\":\"User not found\"}");
            return;
        }

        // -------------------- Follower Count --------------------
        // Public endpoint - returns total follower count
        if ("count".equals(type)) {
            int count = followDAO.countFollowers(targetUserId);
            out.print("{\"count\":" + count + "}");
            return;
        }

        // Get current user for privacy checks
        Integer currentUserId = SessionUtil.getCurrentUserId(request.getSession(false));

        // -------------------- Follower List --------------------
        // Returns list of followers with privacy filtering
        if ("list".equals(type)) {
            // Privacy check for private profiles
            if (targetUser.isPrivate() && (currentUserId == null || !currentUserId.equals(targetUser.getID()))) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                out.print("{\"error\":\"This profile is private\"}");
                return;
            }

            // Get and filter followers based on privacy settings
            List<Follow> followers = followDAO.getFollowers(targetUserId);
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            boolean first = true;

            for (Follow f : followers) {
                // Get follower's privacy settings
                User followerUser = userDAO.getOne(f.getFollowerId());
                
                // Skip private profiles unless viewer has permission
                if (followerUser.isPrivate() && 
                    (currentUserId == null || 
                    (!currentUserId.equals(targetUserId) && !currentUserId.equals(followerUser.getID())))) {
                    continue;
                }

                // Build JSON response for each follower
                if (!first) {
                    sb.append(",");
                }
                first = false;

                sb.append("{\"id\":").append(f.getId())
                  .append(",\"followerId\":").append(f.getFollowerId())
                  .append(",\"followingId\":").append(f.getFollowingId())
                  .append(",\"status\":\"").append(f.getStatus()).append("\"")
                  .append(",\"followAt\":\"").append(f.getFollowAt()).append("\"")
                  .append(",\"username\":\"").append(f.getUsername()).append("\"")
                  .append(",\"avatarUrl\":").append(f.getAvatarUrl() != null ? "\"" + f.getAvatarUrl() + "\"" : "null")
                  .append(",\"isPrivate\":").append(followerUser.isPrivate())
                  .append("}");
            }
            sb.append("]");
            out.print(sb.toString());
        } 
        // -------------------- Following List --------------------
        // Returns list of users being followed with privacy filtering
        else if ("following".equals(type)) {
            // Privacy check for private profiles
            if (targetUser.isPrivate() && (currentUserId == null || !currentUserId.equals(targetUser.getID()))) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                out.print("{\"error\":\"This profile is private\"}");
                return;
            }

            // Get and filter following list based on privacy settings
            List<Follow> following = followDAO.getFollowing(targetUserId);
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            boolean first = true;

            for (Follow f : following) {
                // Get followed user's privacy settings
                User followedUser = userDAO.getOne(f.getFollowingId());
                
                // Skip private profiles unless viewer has permission
                if (followedUser.isPrivate() && 
                    (currentUserId == null || 
                    (!currentUserId.equals(targetUserId) && !currentUserId.equals(followedUser.getID())))) {
                    continue;
                }

                // Build JSON response for each followed user
                if (!first) {
                    sb.append(",");
                }
                first = false;

                sb.append("{\"id\":").append(f.getId())
                  .append(",\"followerId\":").append(f.getFollowerId())
                  .append(",\"followingId\":").append(f.getFollowingId())
                  .append(",\"status\":\"").append(f.getStatus()).append("\"")
                  .append(",\"followAt\":\"").append(f.getFollowAt()).append("\"")
                  .append(",\"username\":\"").append(followedUser.getUsername()).append("\"")
                  .append(",\"avatarUrl\":").append(followedUser.getAvatarURL() != null ? "\"" + followedUser.getAvatarURL() + "\"" : "null")
                  .append(",\"isPrivate\":").append(followedUser.isPrivate())
                  .append("}");
            }
            sb.append("]");
            out.print(sb.toString());
        }
        // -------------------- Follow Status --------------------
        // Checks if current user is following target user
        else if ("status".equals(type)) {
            if (currentUserId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                out.print("{\"error\":\"Not logged in\"}");
                return;
            }
            boolean isFollowing = followDAO.isFollowing(currentUserId, targetUserId);
            out.print("{\"isFollowing\":" + isFollowing + "}");
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\":\"Invalid type\"}");
        }
    }
}
