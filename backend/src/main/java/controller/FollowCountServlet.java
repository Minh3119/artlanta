package controller;

// Required imports for database operations and servlets
import dal.FollowDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.json.JSONObject;
import util.JsonUtil;

// ==================== Follow Count Servlet ====================
// Handles requests for getting both follower and following counts for a user
@WebServlet("/api/follow-count/*")
public class FollowCountServlet extends HttpServlet {
    
    // Database access object for follow operations
    private FollowDAO followDAO = new FollowDAO();
    
    // -------------------- GET Endpoint --------------------
    // Returns both follower and following counts for a user
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        // Extract user ID from URL path
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
        
        // Fetch both follower and following counts
        int followers = followDAO.countFollowers(userId);
        int following = followDAO.countFollowed(userId);
        
        // Build and send JSON response
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("success", true);
        JSONObject data = new JSONObject();
        data.put("followers", followers);
        data.put("following", following);
        jsonResponse.put("response", data);
        
        response.getWriter().write(jsonResponse.toString());
    }
} 