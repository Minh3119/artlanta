package controller.UserHistory;

import dal.UserHistoryDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

@WebServlet("/api/history/add")
public class AddUserHistoryServlet extends HttpServlet {
    private final UserHistoryDAO historyDAO = new UserHistoryDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Integer currentUserId = SessionUtil.getCurrentUserId(request.getSession(false));

        if (currentUserId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            JsonUtil.writeJsonError(response, "User not logged in");
            return;
        }

        try {
            // Parse request body
            JSONObject body = JsonUtil.parseRequestBody(request);
            int postId = body.getInt("postId");
            int artistId = body.getInt("artistId");

            // Add history entry
            boolean success = historyDAO.addHistory(currentUserId, postId, artistId);

            if (success) {
                JsonUtil.writeJsonResponse(response, new JSONObject().put("message", "History added successfully"));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                JsonUtil.writeJsonError(response, "Failed to add history");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JsonUtil.writeJsonError(response, "Invalid request: " + e.getMessage());
        }
    }
}
