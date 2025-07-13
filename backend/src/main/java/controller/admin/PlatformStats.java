/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.admin;

import dal.LikesDAO;
import dal.PostDAO;
import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import model.Comment;
import model.Post;
import model.User;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import static util.SessionUtil.getCurrentUserId;

/**
 *
 * @author Asus
 */
public class PlatformStats extends HttpServlet {

	/**
	 * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
	 * methods.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	protected void processRequest(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("text/html;charset=UTF-8");
		try (PrintWriter out = response.getWriter()) {
			/* TODO output your page here. You may use following sample code. */
			out.println("<!DOCTYPE html>");
			out.println("<html>");
			out.println("<head>");
			out.println("<title>Servlet PlatformStats</title>");
			out.println("</head>");
			out.println("<body>");
			out.println("<h1>Servlet PlatformStats at " + request.getContextPath() + "</h1>");
			out.println("</body>");
			out.println("</html>");
		}
	}

	// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
	/**
	 * Handles the HTTP <code>GET</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		HttpSession session = request.getSession(false);
		Integer currentUserId = getCurrentUserId(session);

		JSONObject jsonResponse = new JSONObject();
		UserDAO udao = new UserDAO();

		try {
			if (currentUserId == null || !udao.isAdmin(currentUserId)) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
				jsonResponse.put("isLogged", false);
				jsonResponse.put("message", "Unauthorized");
				JsonUtil.writeJsonResponse(response, jsonResponse);
				return;
			}

			List<User> ULists = udao.getAll();
			JSONArray jsonUsers = new JSONArray();

			for (User user : ULists) {
				JSONObject jsonUser = new JSONObject();
				jsonUser.put("ID", user.getID());
				jsonUser.put("username", user.getUsername());
				jsonUser.put("email", user.getEmail());
				jsonUser.put("passwordHash", user.getPasswordHash());
				jsonUser.put("fullName", user.getFullName());
				jsonUser.put("bio", user.getBio());
				jsonUser.put("avatarURL", user.getAvatarURL());
				jsonUser.put("gender", user.getGender());
				jsonUser.put("DOB", user.getDOB() != null ? user.getDOB().toString() : null);
				jsonUser.put("location", user.getLocation());
				jsonUser.put("role", user.getRole());
				jsonUser.put("status", user.getStatus());
				jsonUser.put("language", user.getLanguage());
				jsonUser.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString().substring(0, 10) : null);
				jsonUser.put("lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString() : null);
				jsonUser.put("isFlagged", user.isFlagged());
				jsonUser.put("isPrivate", user.isPrivate());
				jsonUsers.put(jsonUser);
			}

			jsonResponse.put("isLogged", true);
			jsonResponse.put("response", jsonUsers);
			jsonResponse.put("mostUserCreDay", udao.getMostUserCreatedDate());
			jsonResponse.put("total_user", udao.countUsers());
			jsonResponse.put("total_BUser", udao.countBannedUsers());
			jsonResponse.put("total_Mod", udao.countMod());

			JsonUtil.writeJsonResponse(response, jsonResponse);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			jsonResponse.put("error", "Server error");
			JsonUtil.writeJsonResponse(response, jsonResponse);
		} finally {
			udao.closeConnection();
		}
	}

	/**
	 * Handles the HTTP <code>POST</code> method.
	 *
	 * @param request servlet request
	 * @param response servlet response
	 * @throws ServletException if a servlet-specific error occurs
	 * @throws IOException if an I/O error occurs
	 */
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");

		String userIdParam = request.getParameter("userId");
		JSONObject json = new JSONObject();

		if (userIdParam == null) {
			json.put("success", false);
			json.put("message", "Missing userId parameter");
			JsonUtil.writeJsonResponse(response, json);
			return;
		}

		try {
			int userId = Integer.parseInt(userIdParam);
			UserDAO userDAO = new UserDAO();
			boolean result = userDAO.toggleUserStatus(userId);
			userDAO.closeConnection();

			if (result) {
				json.put("success", true);
				json.put("message", "User status updated");
			} else {
				json.put("success", false);
				json.put("message", "User not found or failed to update");
			}
		} catch (NumberFormatException e) {
			json.put("success", false);
			json.put("message", "Invalid userId format");
		}

		JsonUtil.writeJsonResponse(response, json);
	}

	/**
	 * Returns a short description of the servlet.
	 *
	 * @return a String containing servlet description
	 */
	@Override
	public String getServletInfo() {
		return "Short description";
	}// </editor-fold>

}
