package controller;

import dal.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import model.User;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;

@WebServlet("/api/user/*")
public class UserServlet extends HttpServlet {

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        UserDAO dao = new UserDAO();
        String pathInfo = request.getPathInfo(); // Gets the path after /api/user/
        String roleParam = request.getParameter("role"); // Get the role query parameter

        // If role parameter is present, return all users with that role
        if (roleParam != null && !roleParam.isEmpty()) {
            List<User> users = dao.getByRole(roleParam);
            JSONArray jsonUsers = new JSONArray();
            
            for (User user : users) {
                JSONObject jsonUser = new JSONObject();
                jsonUser.put("id", user.getId());
                jsonUser.put("username", user.getUsername());
                jsonUser.put("displayName", user.getFullName());
                jsonUser.put("bio", user.getBio());
                jsonUser.put("avatarUrl", user.getAvatarUrl());
                jsonUser.put("location", user.getLocation());
                jsonUser.put("language", user.getLanguage());
                jsonUser.put("createdAt", user.getCreatedAt().toString());
                jsonUsers.put(jsonUser);
            }

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("response", jsonUsers);
            JsonUtil.writeJsonResponse(response, jsonResponse);
            return;
        }

        // If no role parameter, handle single user request
        int userId = -1;
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

        User user = dao.getOne(userId);
        if (user == null) {
            JsonUtil.writeJsonError(response, "User not found");
            return;
        }

        request.getSession().setAttribute("lastUsername", user.getUsername());

        // Respond
        JSONObject jsonUser = new JSONObject();
        jsonUser.put("id", user.getId());
        jsonUser.put("username", user.getUsername());
        jsonUser.put("fullname", user.getFullName());
        jsonUser.put("bio", user.getBio());
        jsonUser.put("avatarUrl", user.getAvatarUrl());
        jsonUser.put("location", user.getLocation());
        jsonUser.put("language", user.getLanguage());
        jsonUser.put("createdAt", user.getCreatedAt().toString());

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonUser);

        JsonUtil.writeJsonResponse(response, jsonResponse);
    }
}
