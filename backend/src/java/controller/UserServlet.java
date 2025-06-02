package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.json.JSONObject;
import util.JsonUtil;
import service.UserService;

@WebServlet("/api/user/*")
public class UserServlet extends HttpServlet {
    private final UserService userService;

    public UserServlet() {
        this.userService = new UserService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String roleParam = request.getParameter("role");
            if (roleParam != null && !roleParam.isEmpty()) {
                // For example: /api/user?role=ARTIST
                handleGetUsersByRole(roleParam, response);
                return;
            }

            String pathInfo = request.getPathInfo();
            handleGetSingleUser(pathInfo, request, response);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private void handleGetUsersByRole(String role, HttpServletResponse response) throws IOException {
        try {
            JSONObject result = userService.getUsersByRole(role);
            JsonUtil.writeJsonResponse(response, result);
        } catch (IllegalArgumentException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            JsonUtil.writeJsonError(response, e.getMessage());
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private void handleGetSingleUser(String pathInfo, HttpServletRequest request, HttpServletResponse response) 
            throws IOException {
        try {
            int userId = extractUserId(pathInfo);
            if (userId == -1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                JsonUtil.writeJsonError(response, "Invalid or missing user ID");
                return;
            }

            JSONObject result = userService.getUserById(userId);
            if (result == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                JsonUtil.writeJsonError(response, "User not found");
                return;
            }

            try {
                request.getSession().setAttribute("lastUsername", 
                    result.getJSONObject("response").getString("username"));
            } catch (IllegalStateException e) {
                e.printStackTrace();
            }

            JsonUtil.writeJsonResponse(response, result);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    // Get (extract) userId from pathInfo string
    private int extractUserId(String pathInfo) {
        if (pathInfo == null || pathInfo.length() <= 1) {
            return -1;
        }
        
        try {
            int userId = Integer.parseInt(pathInfo.substring(1));
            return userId > 0 ? userId : -1;
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    private void handleError(HttpServletResponse response, String message, Exception e) throws IOException {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        JsonUtil.writeJsonError(response, message + ": " + e.getMessage());
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        handleError(response, "An unexpected error occurred", e);
    }
}
