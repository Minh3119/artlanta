package controller;

import dal.UserDAO;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import model.User;
import org.json.JSONObject;
import util.SessionUtil;

@WebServlet(name = "LoginServlet", urlPatterns = {"/api/login"})
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        BufferedReader reader = request.getReader();
        StringBuilder jsonBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }

        JSONObject body = new JSONObject(jsonBuilder.toString());
        String email = body.optString("email");
        String password = body.optString("password");

        UserDAO dao = new UserDAO();
        JSONObject res = new JSONObject();
        User user = dao.getUserByEmailAndPassword(email, password);
        if (user == null) {
            res.put("success", false);
            res.put("message", "Sai tài khoản hoặc mật khẩu");
        } else {
            HttpSession session = request.getSession(true);
            int userId = dao.getUserIdByEmail(email);
            SessionUtil.storeUserInSession(session,userId);
            res.put("success", true);
            res.put("user", new JSONObject()
                    .put("id", user.getID())
                    .put("username", user.getUsername())
                    .put("email", user.getEmail())
                    .put("fullName", user.getFullName())
                    .put("bio", user.getBio())
                    .put("avatarURL", user.getAvatarURL())
                    .put("gender", user.getGender())
                    .put("dob", user.getDOB() != null ? user.getDOB().toString() : JSONObject.NULL)
                    .put("location", user.getLocation())
                    .put("role", user.getRole())
                    .put("status", user.getStatus())
                    .put("language", user.getLanguage())
                    .put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : JSONObject.NULL)
                    .put("lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString() : JSONObject.NULL)
                    .put("isFlagged", user.isFlagged())
                    .put("isPrivate", user.isPrivate())
            );
        }

        response.getWriter().write(res.toString());
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
