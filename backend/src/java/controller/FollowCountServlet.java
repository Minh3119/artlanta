package controller;

import dal.FollowDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.json.JSONObject;
import util.JsonUtil;

@WebServlet("/api/follow-count/*")
public class FollowCountServlet extends HttpServlet {
    
    private FollowDAO followDAO = new FollowDAO();
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Get the user ID from the URL
        int userId = -1;
        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1) {
            String idStr = pathInfo.substring(1);
            try {
                userId = Integer.parseInt(idStr);
                if (userId <= 0) {
                    JsonUtil.writeJsonError(response, "Invalid user ID");
                    return;
                }
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonError(response, "Invalid user ID");
                return;
            }
        } else {
            JsonUtil.writeJsonError(response, "User ID missing");
            return;
        }
        
        // Get follower and following counts using separate methods
        int followers = followDAO.countFollowers(userId);
        int following = followDAO.countFollowing(userId);
        
        // Create JSON response
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("success", true);
        JSONObject data = new JSONObject();
        data.put("followers", followers);
        data.put("following", following);
        jsonResponse.put("response", data);
        
        response.getWriter().write(jsonResponse.toString());
    }
} 