package controller.Comment;

import dal.NotificationDAO;
import dal.UserDAO;
import dal.PostDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import model.Post;
import org.json.JSONObject;

import java.io.IOException;

import static util.SessionUtil.getCurrentUserId;

@WebServlet(name = "AddCommentServlet", urlPatterns = {"/api/comment/add"})
public class AddCommentServlet extends HttpServlet {

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
            return;
        }

        try {
            String postIDStr = request.getParameter("postID");
            String content = request.getParameter("content");

            if (postIDStr == null || postIDStr.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"postID không được để trống\"}");
                return;
            }

            int postID;
            try {
                postID = Integer.parseInt(postIDStr);
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"postID không hợp lệ\"}");
                return;
            }

            if (content == null || content.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"Nội dung bình luận không được để trống\"}");
                return;
            }

            PostDAO pdao = new PostDAO();
            boolean success = pdao.insertComment(postID, userID, content);

            JSONObject resJson = new JSONObject();
            resJson.put("success", success);
            if (!success) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resJson.put("error", "Không thể thêm bình luận");
            } else {
                // --- Notification logic ---
                NotificationDAO notificationDAO = new NotificationDAO();
                UserDAO userDAO = new UserDAO();
                Post post = pdao.getPost(postID);
                int postOwnerId = post.getUserID();

                if (postOwnerId != userID) { // Don't notify if user comments on their own post
                    User commenter = userDAO.getOne(userID);
                    if (commenter != null) {
                        String notificationType = "comment";
                        String notificationContent = commenter.getUsername() + " commented on your post";
                        notificationDAO.saveNotification(postOwnerId, postID, notificationType, notificationContent);
                    }
                }
                // --- End notification logic ---
            }
            response.getWriter().write(resJson.toString());
            pdao.closeConnection();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Yêu cầu không hợp lệ: " + e.getMessage() + "\"}");
        }
    }

    @Override
    public String getServletInfo() {
        return "Xử lý thêm bình luận cho bài viết qua GET với query parameters";
    }
}
