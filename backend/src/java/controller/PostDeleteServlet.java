package controller;

import dal.DAO;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.*;
import org.json.JSONObject;

public class PostDeleteServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("application/json;charset=UTF-8");

        HttpSession session = request.getSession(false);
        Integer userId = (session != null) ? (Integer) session.getAttribute("userId") : null;

        JSONObject jsonResponse = new JSONObject();

        if (userId == null) {
            jsonResponse.put("success", false);
            jsonResponse.put("message", "User not logged in.");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        } else {
            StringBuilder sb = new StringBuilder();
            String line;
            try (BufferedReader reader = request.getReader()) {
                while ((line = reader.readLine()) != null) {
                    sb.append(line);
                }
            }
            JSONObject jsonRequest = new JSONObject(sb.toString());

            int postId = jsonRequest.optInt("postId");

            DAO dao = new DAO();
            String result = dao.deletePost(postId);

            jsonResponse.put("success", result.contains("successfully"));
            jsonResponse.put("message", result);
        }

        try (PrintWriter out = response.getWriter()) {
            out.print(jsonResponse.toString());
        }
    }
}