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
        
        FollowDAO followDAO = new FollowDAO();
        int followersCount = followDAO.getFollowersCount(userId);
        int followingCount = followDAO.getFollowingCount(userId);
        
        // Create JSON response
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("success", true);
        JSONObject data = new JSONObject();
        data.put("followers", followersCount);
        data.put("following", followingCount);
        jsonResponse.put("response", data);
        
        response.getWriter().write(jsonResponse.toString());
    }
} 