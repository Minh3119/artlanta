package controller;

import dal.UserDAO;
import java.io.BufferedReader;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

@WebServlet(name = "RegisterServlet", urlPatterns = {"/api/register"})
public class RegisterServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JSONObject requestBody = readRequestBody(request);
        String email = requestBody.optString("email");
        String username = requestBody.optString("username");
        String password = requestBody.optString("password");

        UserDAO userDAO = new UserDAO();
        JSONObject jsonResponse = new JSONObject();

        if (userDAO.checkUserExistsByEmail(email)) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Email đã tồn tại");
        } else if (userDAO.checkUserExistsByUserName(username)) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "Username đã tồn tại");
        } else {
            userDAO.registerUser(username, email, password);
            jsonResponse.put("success", true);
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
