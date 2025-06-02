package controller.Like;

import dal.LikesDAO;
import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
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

    try {
       
        String postIdStr = request.getParameter("postId");
	int userId = getCurrentUserId(session);
		String  errorvString=Boolean.toString(isLoggedIn(session));
        if (userId== 0 || postIdStr == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            jsonResponse.put("status", "error");
            jsonResponse.put("message", "Missing userId or postId");
            out.print(jsonResponse.toString());
            return;
        }

        
        int postId = Integer.parseInt(postIdStr);
        LikesDAO likesDAO = new LikesDAO();
        boolean success = likesDAO.toggleLike(userId, postId);

        jsonResponse.put("status", success ? "success" : "error");
        jsonResponse.put("message", success ? "Toggle like thành công" : "Toggle like thất bại");
        jsonResponse.put("newState", likesDAO.isLiked(userId, postId)); // gửi trạng thái mới

    } catch (Exception e) {
        e.printStackTrace();
			String  errorvString=Boolean.toString(isLoggedIn(session));
        jsonResponse.put("status", "error");
        jsonResponse.put("message", "Lỗi: " + e.getMessage());
    }

    out.print(jsonResponse.toString());
    out.flush();
}
	
}
