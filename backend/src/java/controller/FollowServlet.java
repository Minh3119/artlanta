package controller;

import dal.FollowDAO;
import dal.UserDAO;
import model.Follow;
import model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import util.SessionUtil;

@WebServlet("/api/follow")
public class FollowServlet extends HttpServlet {

    private FollowDAO followDAO = new FollowDAO();
    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"Not logged in\"}");
            return;
        }

        String action = request.getParameter("action");
        int targetId = Integer.parseInt(request.getParameter("targetId"));

        boolean result = false;
        if ("follow".equals(action)) {
            result = followDAO.follow(userId, targetId);
        } else if ("unfollow".equals(action)) {
            result = followDAO.unfollow(userId, targetId);
        }
        out.print("{\"success\":" + result + "}");
    }

    @Override
    protected void doGet(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        
        String type = request.getParameter("type");
        int targetUserId = Integer.parseInt(request.getParameter("userId"));

        // Get target user to check privacy settings
        User targetUser = userDAO.getOne(targetUserId);
        if (targetUser == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            out.print("{\"error\":\"User not found\"}");
            return;
        }

        // Count endpoint is public
        if ("count".equals(type)) {
            int count = followDAO.countFollowers(targetUserId);
            out.print("{\"count\":" + count + "}");
            return;
        }

        // Get current user if logged in
        Integer currentUserId = SessionUtil.getCurrentUserId(request.getSession(false));

        if ("list".equals(type)) {
            // Check if profile is private and if current user has access
            if (targetUser.isPrivate() && (currentUserId == null || !currentUserId.equals(targetUser.getID()))) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                out.print("{\"error\":\"This profile is private\"}");
                return;
            }

            // Get followers and filter based on privacy settings
            List<Follow> followers = followDAO.getFollowers(targetUserId);
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            boolean first = true;

            for (Follow f : followers) {
                // Get the follower's user data to check their privacy setting
                User followerUser = userDAO.getOne(f.getFollowerId());
                
                // Skip private profiles unless the current user is the profile owner or the follower
                if (followerUser.isPrivate() && 
                    (currentUserId == null || 
                    (!currentUserId.equals(targetUserId) && !currentUserId.equals(followerUser.getID())))) {
                    continue;
                }

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
        } else if ("following".equals(type)) {
            // Check if profile is private and if current user has access
            if (targetUser.isPrivate() && (currentUserId == null || !currentUserId.equals(targetUser.getID()))) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                out.print("{\"error\":\"This profile is private\"}");
                return;
            }

            // Get following list and filter based on privacy settings
            List<Follow> following = followDAO.getFollowing(targetUserId);
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            boolean first = true;

            for (Follow f : following) {
                // Get the followed user's data to check their privacy setting
                User followedUser = userDAO.getOne(f.getFollowingId());
                
                // Skip private profiles unless the current user is the profile owner or the followed user
                if (followedUser.isPrivate() && 
                    (currentUserId == null || 
                    (!currentUserId.equals(targetUserId) && !currentUserId.equals(followedUser.getID())))) {
                    continue;
                }

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
        } else if ("status".equals(type)) {
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
