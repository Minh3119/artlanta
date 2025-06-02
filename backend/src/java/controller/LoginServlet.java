package controller;

import dal.UserDAO;
import java.io.BufferedReader;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import org.json.JSONObject;
import util.SessionUtil;

@WebServlet(name = "LoginServlet", urlPatterns = {"/api/login"})
public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject requestBody = readRequestBody(request);
        String email = requestBody.optString("email");
        String password = requestBody.optString("password");

        UserDAO userDAO = new UserDAO();
        User user = userDAO.getUserByEmailAndPassword(email, password);

        JSONObject jsonResponse = new JSONObject();

        if (user == null) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Sai tài khoản hoặc mật khẩu");
        } else {
            HttpSession session = request.getSession(true);
            int userId = userDAO.getUserIdByEmail(email);
            SessionUtil.storeUserInSession(session, userId);

            jsonResponse.put("success", true);
            jsonResponse.put("user", new JSONObject()
                    .put("id", user.getID())
                    .put("username", user.getUsername())
                    .put("email", user.getEmail()));
        }

        response.getWriter().write(jsonResponse.toString());
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    private JSONObject readRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        return new JSONObject(sb.toString());
    }
}
