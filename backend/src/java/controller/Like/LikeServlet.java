package controller.Like;

import dal.LikesDAO;
import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import static util.SessionUtil.getCurrentUserId;
import static util.SessionUtil.isLoggedIn;

public class LikeServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
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
			jsonResponse.put("newState", likesDAO.isLiked(currentUserId, postId));

		} catch (Exception e) {
			e.printStackTrace();
			String errorvString = Boolean.toString(isLoggedIn(session));
			jsonResponse.put("status", "error");
			jsonResponse.put("message", "Lỗi: " + e.getMessage());
		}
		likesDAO.closeConnection();
		out.print(jsonResponse.toString());
		out.flush();
	}

}
