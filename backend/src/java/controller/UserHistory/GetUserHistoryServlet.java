package controller.UserHistory;

import dal.UserHistoryDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.List;
import model.UserHistory;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import static util.SessionUtil.getCurrentUserId;

@WebServlet("/api/history/get")
public class GetUserHistoryServlet extends HttpServlet {
    private final UserHistoryDAO historyDAO = new UserHistoryDAO();
    private static final int DEFAULT_LIMIT = 20;

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        Integer currentUserId = getCurrentUserId(session);

        if (currentUserId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            JsonUtil.writeJsonError(response, "User not logged in");
            return;
        }

        try {
            // Get limit parameter, default to DEFAULT_LIMIT if not provided
            int limit = DEFAULT_LIMIT;
            String limitParam = request.getParameter("limit");
            if (limitParam != null && !limitParam.isEmpty()) {
                limit = Integer.parseInt(limitParam);
            }

            // Get user history
            List<UserHistory> history = historyDAO.getUserHistory(currentUserId, limit);
            
            // Convert to JSON
            JSONArray historyArray = new JSONArray();
            for (UserHistory entry : history) {
                JSONObject historyObj = new JSONObject()
                    .put("id", entry.getId())
                    .put("postId", entry.getPostId())
                    .put("artistId", entry.getArtistId())
                    .put("viewedAt", entry.getViewedAt().toString());
                historyArray.put(historyObj);
            }

            JsonUtil.writeJsonResponse(response, new JSONObject().put("history", historyArray));
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JsonUtil.writeJsonError(response, "Invalid limit parameter");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonUtil.writeJsonError(response, "Error retrieving history: " + e.getMessage());
        }
    }
}
