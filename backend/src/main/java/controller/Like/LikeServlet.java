package controller.Like;

import dal.LikesDAO;
import dal.NotificationDAO;
import dal.UserDAO;
import model.User;
import model.Post;
import dal.PostDAO;

import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import static util.SessionUtil.getCurrentUserId;
import static util.SessionUtil.isLoggedIn;

public class LikeServlet extends HttpServlet {

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		HttpSession session = request.getSession();
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject jsonResponse = new JSONObject();
		LikesDAO likesDAO = new LikesDAO();

		int currentUserId = getCurrentUserId(session);
		try {
			String postIdStr = request.getParameter("postId");
			if (currentUserId == 0 || postIdStr == null) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				jsonResponse.put("status", "error");
				jsonResponse.put("message", "Missing userId or postId");
				out.print(jsonResponse.toString());
				return;
			}

			int postId = Integer.parseInt(postIdStr);
			boolean success = likesDAO.toggleLike(currentUserId, postId);
			boolean isLiked = likesDAO.isLiked(currentUserId, postId);
			jsonResponse.put("isLiked", isLiked);
			jsonResponse.put("status", success ? "success" : "error");
			jsonResponse.put("message", success ? "Toggle like thành công" : "Toggle like thất bại");
			jsonResponse.put("newState", isLiked);
			// jsonResponse.put("newState", likesDAO.isLiked(currentUserId, postId));

			// Send notification if the post is now liked
			if (success && isLiked) {
				NotificationDAO notificationDAO = new NotificationDAO();
				UserDAO userDAO = new UserDAO();
				PostDAO postDAO = new PostDAO();
				Post post = postDAO.getPost(postId);
				int postOwnerId = post.getUserID();

				if (postOwnerId != currentUserId) { // Don't notify if user likes their own post
					User liker = userDAO.getOne(currentUserId);
					if (liker != null) {
						String notificationType = "like";
						String notificationContent = liker.getUsername() + " liked your post";
						notificationDAO.saveNotification(postOwnerId, postId, notificationType, notificationContent);
					}
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse.put("status", "error");
			jsonResponse.put("message", "Lỗi: " + e.getMessage());
		}
		likesDAO.closeConnection();
		out.print(jsonResponse.toString());
		out.flush();
	}
}
