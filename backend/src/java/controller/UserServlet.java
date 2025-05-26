package controller;

import dal.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import model.User;
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

        // Get the last part of the URL
        int userId = -1;
        String pathInfo = request.getPathInfo(); // example: "/2"
        if (pathInfo != null && pathInfo.length() > 1) {
            String idStr = pathInfo.substring(1); // remove leading "/"
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

        UserDAO dao = new UserDAO();
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
        jsonUser.put("displayName", user.getFullName());
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
