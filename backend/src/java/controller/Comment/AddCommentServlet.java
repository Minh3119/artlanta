
package controller.Comment;

import dal.PostDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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

        System.out.println("Received GET request to /api/comment/add");

        HttpSession session = request.getSession(false);
        Integer userID = getCurrentUserId(session);

        if (userID == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Không đăng nhập\"}");
            System.out.println("Error: User not logged in");
            return;
        }

        try {
            // Lấy postID và content từ query parameters
            String postIDStr = request.getParameter("postID");
            String content = request.getParameter("content");

            System.out.println("Query params - postID: " + postIDStr + ", content: " + content);

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

            if (content == null || content.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\":\"Nội dung bình luận không được để trống\"}");
                System.out.println("Error: Empty comment content");
                return;
            }

            PostDAO pdao = new PostDAO();
            boolean success = pdao.insertComment(postID, userID, content);

            JSONObject resJson = new JSONObject();
            resJson.put("success", success);
            if (!success) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resJson.put("error", "Không thể thêm bình luận");
                System.out.println("Error: Failed to insert comment");
            }
            response.getWriter().write(resJson.toString());
            pdao.closeConnection();
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\":\"Yêu cầu không hợp lệ: " + e.getMessage() + "\"}");
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public String getServletInfo() {
        return "Xử lý thêm bình luận cho bài viết qua GET với query parameters";
    }
}
