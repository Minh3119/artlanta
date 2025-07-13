package controller.Search;

import dal.MediaDAO;
import dal.PostDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;
import model.Post;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

public class SearchPost extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PostDAO pd = new PostDAO();
        MediaDAO md = new MediaDAO();
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject json = new JSONObject(sb.toString());
        String searchValue = json.optString("searchValue", "").trim();

        List<Post> list = new ArrayList<>();
        try {
            list = pd.getPostBySearch(searchValue);

            JSONArray arr = new JSONArray();
            for (Post post : list) {
                JSONObject obj = new JSONObject();
                obj.put("postID", post.getID());
                obj.put("visibility", post.getVisibility());
                obj.put("content", post.getContent());
                obj.put("author", post.getUserName());
                obj.put("createAt", post.getCreatedAt().toLocalDate());
                obj.put("image",md.getMediaByPostID(post.getID()));

                arr.put(obj);
            }
			pd.closeConnection();
			md.closeConnection();
            JSONObject jsonPost = new JSONObject();
            jsonPost.put("response", arr);

            JsonUtil.writeJsonResponse(response, jsonPost);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
