package controller;

import service.CommissionService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import util.SessionUtil;
import util.JsonUtil;
import java.io.IOException;

import org.json.JSONObject;

@WebServlet("/api/commissions/*")
public class CommissionServlet extends HttpServlet {
    private final CommissionService commissionService = new CommissionService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (!SessionUtil.isLoggedIn(session)) {
            JsonUtil.writeJsonError(response, "User not logged in", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        int userId = SessionUtil.getCurrentUserId(session);
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.equals("/") || pathInfo.isEmpty()) {
            // List all commissions for user
            JSONObject commissions = commissionService.getCommissionsByUserId(userId);
            JsonUtil.writeJsonResponse(response, commissions);
        } else if (pathInfo.matches("/\\d+/history/?")) {
            // Get commission history
            try {
                int commissionId = Integer.parseInt(pathInfo.split("/")[1]);
                var historyArray = commissionService.getCommissionHistory(commissionId);
                JSONObject result = new JSONObject();
                result.put("success", true);
                result.put("history", historyArray);
                JsonUtil.writeJsonResponse(response, result);
            } catch (Exception e) {
                JsonUtil.writeJsonError(response, "Invalid commission ID for history", HttpServletResponse.SC_BAD_REQUEST);
            }
        } else {
            // Try to get commission by ID
            try {
                int commissionId = Integer.parseInt(pathInfo.substring(1));
                JSONObject commission = commissionService.getCommissionById(commissionId, userId);
                if (commission == null) {
                    JsonUtil.writeJsonError(response, "Commission not found", HttpServletResponse.SC_NOT_FOUND);
                } else {
                    JsonUtil.writeJsonResponse(response, commission);
                }
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonError(response, "Invalid commission ID", HttpServletResponse.SC_BAD_REQUEST);
            }
        }
    }
} 