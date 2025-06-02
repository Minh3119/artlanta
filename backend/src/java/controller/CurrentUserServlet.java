package controller;

import org.json.JSONObject;
import dal.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.User;
import util.JsonUtil;
import util.SessionUtil;

import java.io.IOException;

@WebServlet(name = "CurrentUserServlet", urlPatterns = {"/api/current-user"})
public class CurrentUserServlet extends HttpServlet {
    private final UserDAO userDAO;

    public CurrentUserServlet() {
        this.userDAO = new UserDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            // Get user ID from session
            Integer userId = SessionUtil.getCurrentUserId(request.getSession());
            
            if (userId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                JsonUtil.writeJsonError(response, "No user logged in");
                return;
            }

            // Get user data from database
            User user = userDAO.getOne(userId);
            if (user != null) {
                JSONObject jsonResponse = new JSONObject();
                JSONObject userJson = new JSONObject();
                
                // Manually convert User object to JSON
                userJson.put("id", user.getID());
                userJson.put("username", user.getUsername());
                userJson.put("email", user.getEmail());
                userJson.put("fullName", user.getFullName());
                userJson.put("bio", user.getBio());
                userJson.put("avatarUrl", user.getAvatarURL());
                userJson.put("gender", user.getGender());
                userJson.put("location", user.getLocation());
                userJson.put("role", user.getRole());
                userJson.put("status", user.getStatus());
                userJson.put("language", user.getLanguage());
                userJson.put("isFlagged", user.isFlagged());
                userJson.put("isPrivate", user.isPrivate());
                
                jsonResponse.put("response", userJson);
                JsonUtil.writeJsonResponse(response, jsonResponse);
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                JsonUtil.writeJsonError(response, "User not found");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonUtil.writeJsonError(response, e.getMessage());
        }
    }
} 