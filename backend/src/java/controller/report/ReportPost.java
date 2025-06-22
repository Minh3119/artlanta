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
import org.json.JSONObject;
import static util.SessionUtil.getCurrentUserId;
import static util.SessionUtil.isLoggedIn;

/**
 *
 * @author Asus
 */
public class ReportPost extends HttpServlet {

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
