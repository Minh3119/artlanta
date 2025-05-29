package controller.Post;

import dal.PostDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Post;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;

import java.io.IOException;
import java.util.List;


public class PostViewerServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PostDAO dao = new PostDAO();
        List<Post> posts = dao.getAllPosts();

        JSONArray jsonPosts = new JSONArray();

        for (Post post : posts) {
            JSONObject jsonPost = new JSONObject();
            jsonPost.put("id", post.getID());
            jsonPost.put("userId", post.getUserID());
            jsonPost.put("title", post.getTitle());
            jsonPost.put("content", post.getContent());
            jsonPost.put("isDraft", post.isDraft());
            jsonPost.put("visibility", post.getVisibility());
            jsonPost.put("createdAt", post.getCreatedAt().toString());
            jsonPost.put("updatedAt", post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : JSONObject.NULL);
            jsonPost.put("isFlagged", post.isFlagged());
            jsonPosts.put(jsonPost);
        }

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonPosts);

        JsonUtil.writeJsonResponse(response, jsonResponse);
    }
}
