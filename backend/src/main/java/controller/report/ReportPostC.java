/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */

package controller.report;

import dal.LikesDAO;
import dal.ReportDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;
import static util.SessionUtil.getCurrentUserId;
import static util.SessionUtil.isLoggedIn;
import model.ReportPost;

/**
 *
 * @author Asus
 */
public class ReportPostC extends HttpServlet {
	
	@Override
protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    ReportDAO dao = new ReportDAO();
    JSONArray jsonArray = new JSONArray();

    List<ReportPost> reportedPosts = dao.getReportedPosts();
    for (ReportPost rp : reportedPosts) {
        JSONObject json = new JSONObject();
        int postId = rp.getPostID();

        json.put("postId", postId);
        json.put("reportCount", rp.getReason().replace("Total: ", ""));

        String topReason = dao.getTopReasonByPost(postId);
        json.put("topReason", topReason);

        jsonArray.put(json);
    }

    // Bọc vào object "data"
    JSONObject finalJson = new JSONObject();
    finalJson.put("data", jsonArray);

    PrintWriter out = response.getWriter();
    out.print(finalJson.toString());
    out.flush();
}


	
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
       HttpSession session = request.getSession();
		response.setContentType("application/json;charset=UTF-8");
		PrintWriter out = response.getWriter();
		JSONObject jsonResponse = new JSONObject();
		ReportDAO rpdao= new ReportDAO();
		int currentUserId = getCurrentUserId(session);
		try {
			String postIdStr = request.getParameter("postId");
			String reasonStr = request.getParameter("reason");
			if (currentUserId == 0 || postIdStr == null || reasonStr ==null) {
				response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
				jsonResponse.put("status", "error");
				jsonResponse.put("message", "Missing userId or postId");
				out.print(jsonResponse.toString());
				return;
			}

			int postId = Integer.parseInt(postIdStr);
			boolean success = rpdao.insertReport(currentUserId, postId, reasonStr);
			jsonResponse.put("status", success ? "success" : "error");
			jsonResponse.put("message", success ? "Toggle like thành công" : "Toggle like thất bại");

		} catch (Exception e) {
			e.printStackTrace();
			jsonResponse.put("status", "error");
			jsonResponse.put("message", "Lỗi: " + e.getMessage());
		}
		rpdao.closeConnection();
		out.print(jsonResponse.toString());
		out.flush();
    } 

}
