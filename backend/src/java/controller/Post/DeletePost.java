package controller.Post;

import dal.PostDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import util.JsonUtil;

public class DeletePost extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String raw_ID = request.getParameter("postID");
        try {
//            int postID=Integer.parseInt(raw_ID);
            int postID = 26;
            PostDAO pd = new PostDAO();
            pd.deletePost(postID);
            JsonUtil.writeJsonError(response, "Delete completed");
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "Error delete post: " + e.getMessage());
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
