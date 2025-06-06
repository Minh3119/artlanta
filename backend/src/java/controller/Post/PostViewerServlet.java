package controller.Post;

import dal.LikesDAO;
import dal.PostDAO;
import dal.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Post;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import java.io.IOException;
import java.util.List;
import model.Comment;
import model.User;
import static util.SessionUtil.getCurrentUserId;

public class PostViewerServlet extends HttpServlet {

	@Override

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		String pathInfo = request.getPathInfo(); // phần sau /api/post/view

		if (pathInfo == null || pathInfo.isEmpty() || pathInfo.equals("/")) {
			getAllPosts(request, response);
		} else {
			// Trả về 1 post cụ thể
			String[] splits = pathInfo.split("/");
			if (splits.length >= 2) {
				try {
					int postID = Integer.parseInt(splits[1]);
					getPostDetail(request, response, postID);
				} catch (NumberFormatException e) {
					response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
					response.getWriter().write("{\"error\": \"Invalid post ID\"}");
				}
			}
		}
	}

	private void getAllPosts(HttpServletRequest request, HttpServletResponse response) throws IOException {
		PostDAO pdao = new PostDAO();
		UserDAO udao = new UserDAO();
		LikesDAO ldao = new LikesDAO();
		List<Post> posts = pdao.getAllPosts();
		JSONArray jsonPosts = new JSONArray();

		HttpSession session = request.getSession(false);
		Integer currentUserId = getCurrentUserId(session);

		for (Post post : posts) {
			JSONObject jsonPost = new JSONObject();

			User author = udao.getOne(post.getUserID());
			List<String> mediaUrls = pdao.getImageUrlsByPostId(post.getID());
			int likeCount = pdao.getLikeCount(post.getID());
			int commentCount = pdao.getCommentCount(post.getID());
			boolean isLiked = currentUserId != null && ldao.isLiked(currentUserId, post.getID());

			jsonPost.put("postID", post.getID());
			jsonPost.put("mediaURL", mediaUrls);
			jsonPost.put("authorID", post.getUserID());
			jsonPost.put("authorAvatar", author != null ? author.getAvatarURL() : JSONObject.NULL);
			jsonPost.put("authorUN", author != null ? author.getUsername() : JSONObject.NULL);
			jsonPost.put("authorFN", author != null ? author.getFullName() : JSONObject.NULL);
			jsonPost.put("content", post.getContent());
			jsonPost.put("isDraft", post.isDraft());
			jsonPost.put("visibility", post.getVisibility());
			jsonPost.put("createdAt", post.getCreatedAt().toLocalDate());
			jsonPost.put("updatedAt", post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : JSONObject.NULL);
			jsonPost.put("isFlagged", post.isFlagged());
			jsonPost.put("likeCount", likeCount);
			jsonPost.put("commentCount", commentCount);
			jsonPost.put("isLiked", isLiked);
			jsonPost.put("isLogged", currentUserId != null);

			jsonPosts.put(jsonPost);
		}

		JSONObject jsonResponse = new JSONObject();
		jsonResponse.put("response", jsonPosts);
		JsonUtil.writeJsonResponse(response, jsonResponse);

		pdao.closeConnection();
		udao.closeConnection();
		ldao.closeConnection();
	}

	private void getPostDetail(HttpServletRequest request, HttpServletResponse response, int postID) throws IOException {
    UserDAO udao = new UserDAO();
    PostDAO pdao = new PostDAO();
    LikesDAO ldao = new LikesDAO();

    HttpSession session = request.getSession(false);
    Integer currentUserId = getCurrentUserId(session);

    Post post = pdao.getPost(postID);
    if (post == null) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        response.getWriter().write("{\"error\": \"Post not found\"}");
        return;
    }

    User author = udao.getOne(post.getUserID());
    List<Comment> comments = pdao.getCommentsByPostId(postID);
    List<String> mediaUrls = pdao.getImageUrlsByPostId(postID);

    // Tạo mảng JSON cho comments kèm thông tin user
    JSONArray jsonComments = new JSONArray();
    for (Comment c : comments) {
        JSONObject jsonComment = new JSONObject();
	jsonComment.put("content", c.getContent());
        jsonComment.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : JSONObject.NULL);
        jsonComment.put("cmtUserFullName",  pdao.getFNByPostId(post.getID(),c.getID()));
        jsonComment.put("cmtUserAvatarURL",  pdao.getAvatarByPostId(post.getID(),c.getID()));
        jsonComments.put(jsonComment);
    }

    JSONObject jsonPost = new JSONObject();
    jsonPost.put("postID", post.getID());
    jsonPost.put("mediaURL", mediaUrls);
    jsonPost.put("authorID", post.getUserID());
    jsonPost.put("currentUserAvatar", post.getUserID());
    jsonPost.put("authorAvatar", author != null ? author.getAvatarURL() : JSONObject.NULL);
    jsonPost.put("authorUN", author != null ? author.getUsername() : JSONObject.NULL);
    jsonPost.put("authorFN", author != null ? author.getFullName() : JSONObject.NULL);
    jsonPost.put("content", post.getContent());
    jsonPost.put("isDraft", post.isDraft());
    jsonPost.put("visibility", post.getVisibility());
    jsonPost.put("createdAt", post.getCreatedAt() != null ? post.getCreatedAt().toLocalDate() : JSONObject.NULL);
    jsonPost.put("updatedAt", post.getUpdatedAt() != null ? post.getUpdatedAt().toString() : JSONObject.NULL);
    jsonPost.put("isFlagged", post.isFlagged());
    jsonPost.put("likeCount", pdao.getLikeCount(postID));
    jsonPost.put("commentCount", pdao.getCommentCount(postID));
    jsonPost.put("commentsList", jsonComments);
    jsonPost.put("isLiked", currentUserId != null && ldao.isLiked(currentUserId, postID));
    jsonPost.put("isLogged", currentUserId != null);

    JSONObject jsonResponse = new JSONObject();
    jsonResponse.put("response", jsonPost);

    JsonUtil.writeJsonResponse(response, jsonResponse);

    udao.closeConnection();
    pdao.closeConnection();
    ldao.closeConnection();
}


}
