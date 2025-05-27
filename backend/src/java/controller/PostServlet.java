package controller;

import java.io.IOException;
import java.sql.Timestamp;

import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import dal.PostDAO;
import model.Post;
import util.JsonUtil;

@WebServlet("/api/post/*")
public class PostServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Parse ID từ URL: /api/post/5
        int postId = -1;
        String pathInfo = request.getPathInfo(); // ví dụ: "/5"
        if (pathInfo != null && pathInfo.length() > 1) {
            String idStr = pathInfo.substring(1);
            try {
                postId = Integer.parseInt(idStr);
                if (postId <= 0) {
                    JsonUtil.writeJsonError(response, "Invalid post ID");
                    return;
                }
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonError(response, "Invalid post ID");
                return;
            }
        } else {
            JsonUtil.writeJsonError(response, "Post ID missing");
            return;
        }

        PostDAO dao = new PostDAO();
        Post post = dao.getById(postId);
        if (post == null) {
            JsonUtil.writeJsonError(response, "Post not found");
            return;
        }

        // Trả về JSON
        JSONObject jsonPost = new JSONObject();
        jsonPost.put("id", post.getId());
        jsonPost.put("userId", post.getUserId());
        jsonPost.put("title", post.getTitle());
        jsonPost.put("content", post.getContent());
        jsonPost.put("isDraft", post.isDraft());
        jsonPost.put("visibility", post.getVisibility());
        jsonPost.put("createdAt", post.getCreatedAt().toString());
        jsonPost.put("updatedAt", post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : JSONObject.NULL);
        jsonPost.put("isDeleted", post.isDeleted());

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonPost);

        JsonUtil.writeJsonResponse(response, jsonResponse);
    }
}
