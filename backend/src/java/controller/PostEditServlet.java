package controller;

import dal.DAO;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.io.*;
import org.json.JSONObject;

public class PostEditServlet extends HttpServlet {
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
            String title = jsonRequest.optString("title");
            String content = jsonRequest.optString("content");
            String mediaUrl = jsonRequest.optString("mediaUrl");
            boolean isDraft = jsonRequest.optBoolean("isDraft", false);
            String visibility = jsonRequest.optString("visibility", "public");

            DAO dao = new DAO();
            String result = dao.editPost(postId, title, content, mediaUrl, isDraft, visibility);

            jsonResponse.put("success", result.contains("successfully"));
            jsonResponse.put("message", result);
        }

        try (PrintWriter out = response.getWriter()) {
            out.print(jsonResponse.toString());
        }
    }
}