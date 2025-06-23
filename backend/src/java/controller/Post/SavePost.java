package controller.Post;

import dal.LikesDAO;
import dal.PostDAO;
import dal.SaveDAO;
import dal.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;

import java.io.IOException;
import java.util.List;
import model.Post;
import model.User;
import org.json.JSONArray;
import util.JsonUtil;

import static util.SessionUtil.getCurrentUserId;


public class SavePost extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        Integer userID = getCurrentUserId(session);

        if (userID == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Không đăng nhập\"}");
            System.out.println("Error: User not logged in");
            return;
        }

        try {
            String postIDStr = request.getParameter("postID");
            if (postIDStr == null || postIDStr.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"postID không được để trống\"}");
                System.out.println("Error: Missing postID");
                return;
            }

            int postID;
            try {
                postID = Integer.parseInt(postIDStr);
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"postID không hợp lệ\"}");
                System.out.println("Error: Invalid postID format");
                return;
            }

            SaveDAO dao = new SaveDAO();
            boolean success = dao.toggleSavePost(userID, postID);

            JSONObject resJson = new JSONObject();
            resJson.put("success", success);
            if (!success) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resJson.put("error", "Không thể lưu bài viết");
                System.out.println("Error: Failed to insert saved post");
            }

            response.getWriter().write(resJson.toString());
            dao.closeConnection();

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Yêu cầu không hợp lệ: " + e.getMessage() + "\"}");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }


	@Override

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		int offset=0;
		int limit=0;
		try {
			String offsetParam = request.getParameter("offset");
			String limitParam = request.getParameter("limit");
			if (offsetParam!=null) offset = Integer.parseInt(offsetParam);
			if (limitParam!=null) limit = Integer.parseInt(limitParam);
		} catch (NumberFormatException e) {
			offset=0;
		}
		SaveDAO sdao = new SaveDAO();
		PostDAO pdao = new PostDAO();
		UserDAO udao = new UserDAO();
		LikesDAO ldao = new LikesDAO();
		
		JSONArray jsonPosts = new JSONArray();

		HttpSession session = request.getSession(false);
		Integer currentUserId = getCurrentUserId(session);
		List<Post> posts = sdao.getAllSavePosts(limit,offset,currentUserId);
		for (Post post : posts) {
			JSONObject jsonPost = new JSONObject();

			User author = udao.getOne(post.getUserID());
			List<String> mediaUrls = pdao.getImageUrlsByPostId(post.getID());
			int likeCount = pdao.getLikeCount(post.getID());
			int commentCount = pdao.getCommentCount(post.getID());
			boolean isLiked = currentUserId != null && ldao.isLiked(currentUserId, post.getID());
			jsonPost.put("isSaved", sdao.isSaved(currentUserId, post.getID()));
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
}
