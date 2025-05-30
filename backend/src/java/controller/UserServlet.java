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

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        UserDAO dao = new UserDAO();
        String pathInfo = request.getPathInfo(); // Gets the path after /api/user/
        String roleParam = request.getParameter("role"); // Get the role query parameter

        // If role parameter is present, return all users with that role
        if (roleParam != null && !roleParam.isEmpty()) {
            List<User> users = dao.getByRole(roleParam);
            dao.closeConnection();
            JSONArray jsonUsers = new JSONArray();
            
            for (User user : users) {
                JSONObject jsonUser = new JSONObject();
                jsonUser.put("id", user.getID());
                jsonUser.put("username", user.getUsername());
                jsonUser.put("displayName", user.getFullName());
                jsonUser.put("avatarUrl", user.getAvatarURL());
                jsonUser.put("gender", user.getGender());
                jsonUser.put("role", user.getRole());
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
        dao.closeConnection();
        if (user == null) {
            JsonUtil.writeJsonError(response, "User not found");
            return;
        }

        request.getSession().setAttribute("lastUsername", user.getUsername());


        // Respond
        JSONObject jsonUser = new JSONObject();
        jsonUser.put("id", user.getID());
        jsonUser.put("username", user.getUsername());
        jsonUser.put("displayName", user.getFullName());
        jsonUser.put("bio", user.getBio());
        jsonUser.put("avatarUrl", user.getAvatarURL());
        jsonUser.put("gender", user.getGender());
        jsonUser.put("location", user.getLocation());
        jsonUser.put("role", user.getRole());
        jsonUser.put("language", user.getLanguage());
        jsonUser.put("createdAt", user.getCreatedAt().toString());

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonUser);

        JsonUtil.writeJsonResponse(response, jsonResponse);
    }
}
