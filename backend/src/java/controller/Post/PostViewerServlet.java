package controller.Post;

import dal.PostDAO;
import dal.UserDAO;
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
import model.User;

public class PostViewerServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		UserDAO udao = new UserDAO();
		PostDAO pdao = new PostDAO();
		List<Post> posts = pdao.getAllPosts();
		
		JSONArray jsonPosts = new JSONArray();

		for (Post post : posts) {
			User author = udao.getOne(post.getUserID()); // lấy user theo userID của post
			List<String> mediaUrls = pdao.getImageUrlsByPostId(post.getID());
			JSONObject jsonPost = new JSONObject();
			jsonPost.put("mediaURL", mediaUrls);
			jsonPost.put("authorAvatar", author.getAvatarURL());
			jsonPost.put("authorUN", author.getUsername() );
			jsonPost.put("authorFN", author.getFullName());
			jsonPost.put("content", post.getContent());
			jsonPost.put("isDraft", post.isDraft());
			jsonPost.put("visibility", post.getVisibility());
			jsonPost.put("createdAt", post.getCreatedAt().toString());
			jsonPost.put("updatedAt", post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : JSONObject.NULL);
			jsonPost.put("isFlagged", post.isFlagged());
			jsonPost.put("likeCount", pdao.getLikeCount(post.getID()));
			jsonPost.put("commentCount", pdao.getCommentCount(post.getID()));
			jsonPosts.put(jsonPost);
		}

		JSONObject jsonResponse = new JSONObject();
		jsonResponse.put("response", jsonPosts);

		JsonUtil.writeJsonResponse(response, jsonResponse);
	}
}
