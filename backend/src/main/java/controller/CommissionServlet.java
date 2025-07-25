package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import org.json.JSONObject;
import service.CommissionService;
import util.JsonUtil;
import util.SessionUtil;

@WebServlet("/api/commissions/*")
public class CommissionServlet extends HttpServlet {
    private static final String CANCEL_PATTERN = "/\\d+/cancel/?";

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
            // Check for status filter
            String status = request.getParameter("status");
            if (status != null && !status.isEmpty()) {
                JSONObject commissions = commissionService.getCommissionsByUserId(userId, status);
                JsonUtil.writeJsonResponse(response, commissions);
            } else {
                // No status selected, return empty list
                JSONObject empty = new JSONObject();
                empty.put("success", true);
                empty.put("commissions", new org.json.JSONArray());
                JsonUtil.writeJsonResponse(response, empty);
            }
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

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (!SessionUtil.isLoggedIn(session)) {
            JsonUtil.writeJsonError(response, "User not logged in", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        int userId = SessionUtil.getCurrentUserId(session);
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            JsonUtil.writeJsonError(response, "Missing commission ID", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        // Handle /cancel endpoint
        if (pathInfo.matches(CANCEL_PATTERN)) {
            try {
                int commissionId = Integer.parseInt(pathInfo.split("/")[1]);
                JSONObject result = commissionService.cancelCommission(commissionId, userId);
                
                if (result == null) {
                    // Check if commission exists and user has access
                    JSONObject commissionResult = commissionService.getCommissionById(commissionId, userId);
                    if (commissionResult == null) {
                        JsonUtil.writeJsonError(response, "Commission not found or you don't have access", HttpServletResponse.SC_NOT_FOUND);
                        return;
                    }
                    // Get the commission object from the result
                    JSONObject commission = commissionResult.getJSONObject("commission");
                    String status = commission.getString("status");
                    // Check if commission is already completed or cancelled
                    if ("COMPLETED".equals(status) || "CANCELLED".equals(status)) {
                        JsonUtil.writeJsonError(response, "Cannot cancel a commission that is already " + status.toLowerCase(), HttpServletResponse.SC_BAD_REQUEST);
                        return;
                    }
                    JsonUtil.writeJsonError(response, "Failed to cancel commission", HttpServletResponse.SC_BAD_REQUEST);
                    return;
                }

                JsonUtil.writeJsonResponse(response, result);
                return;
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonError(response, "Invalid commission ID", HttpServletResponse.SC_BAD_REQUEST);
                return;
            } catch (Exception e) {
                e.printStackTrace();
                JsonUtil.writeJsonError(response, "Failed to process request: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }
        }

        // Handle /:id/confirm endpoint
        if (pathInfo.matches("/\\d+/confirm/?")) {
            try {
                int commissionId = Integer.parseInt(pathInfo.split("/")[1]);
                JSONObject updated = commissionService.confirmCommissionByClient(commissionId, userId);
                if (updated == null) {
                    JsonUtil.writeJsonError(response, "Commission not found or not allowed", HttpServletResponse.SC_NOT_FOUND);
                } else {
                    JSONObject result = new JSONObject();
                    result.put("success", true);
                    result.put("commission", updated);
                    JsonUtil.writeJsonResponse(response, result);
                }
                return;
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonError(response, "Invalid commission ID", HttpServletResponse.SC_BAD_REQUEST);
                return;
            } catch (Exception e) {
                JsonUtil.writeJsonError(response, "Failed to confirm commission: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
            }
        }

        // Handle commission update
        try {
            int commissionId = Integer.parseInt(pathInfo.substring(1));
            JSONObject body = JsonUtil.parseRequestBody(request);
            String title = body.optString("title", null);
            String description = body.optString("description", null);
            double price = body.optDouble("price", -1);
            
            if (title == null || description == null || price < 0) {
                JsonUtil.writeJsonError(response, "Missing or invalid fields", HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            
            JSONObject updated = commissionService.updateCommission(commissionId, userId, title, description, price);
            if (updated == null) {
                JsonUtil.writeJsonError(response, "Commission not found or not allowed", HttpServletResponse.SC_NOT_FOUND);
            } else {
                JSONObject result = new JSONObject();
                result.put("success", true);
                result.put("commission", updated);
                JsonUtil.writeJsonResponse(response, result);
            }
        } catch (NumberFormatException e) {
            JsonUtil.writeJsonError(response, "Invalid commission ID", HttpServletResponse.SC_BAD_REQUEST);
        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Failed to update commission: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (!SessionUtil.isLoggedIn(session)) {
            JsonUtil.writeJsonError(response, "User not logged in", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        int userId = SessionUtil.getCurrentUserId(session);
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || !pathInfo.matches("/\\d+/submit/?")) {
            JsonUtil.writeJsonError(response, "Invalid endpoint for commission submit", HttpServletResponse.SC_NOT_FOUND);
            return;
        }
        int commissionId;
        try {
            commissionId = Integer.parseInt(pathInfo.split("/")[1]);
        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Invalid commission ID", HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        try {
            // No file upload logic here. Only accept URL from JSON body.
            JSONObject body = JsonUtil.parseRequestBody(request);
            String fileDeliveryURL = body.optString("fileDeliveryURL", null);
            if (fileDeliveryURL == null) {
                System.out.println("fileDeliveryURL is null in request");
                JsonUtil.writeJsonError(response, "Missing fileDeliveryURL", HttpServletResponse.SC_BAD_REQUEST);
                return;
            }
            JSONObject updated = commissionService.submitCommission(commissionId, userId, fileDeliveryURL, fileDeliveryURL);
            if (updated == null) {
                JsonUtil.writeJsonError(response, "Commission not found or not allowed", HttpServletResponse.SC_NOT_FOUND);
            } else {
                JSONObject result = new JSONObject();
                result.put("success", true);
                result.put("commission", updated);
                JsonUtil.writeJsonResponse(response, result);
            }
        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Failed to submit commission: " + e.getMessage(), HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			e.printStackTrace();
        }
    }
}