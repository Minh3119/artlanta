/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.admin;

import dal.UserDAO;
import dal.WalletDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import model.User;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import static util.SessionUtil.getCurrentUserId;

/**
 *
 * @author Asus
 */
public class PaymentStats extends HttpServlet {

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
			out.println("<title>Servlet PaymentStats</title>");
			out.println("</head>");
			out.println("<body>");
			out.println("<h1>Servlet PaymentStats at " + request.getContextPath() + "</h1>");
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
		WalletDAO pdao = new WalletDAO();
		UserDAO udao = new UserDAO();

		try {
			if (currentUserId == null || !udao.isAdmin(currentUserId)) {
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				jsonResponse.put("isLogged", false);
				jsonResponse.put("message", "Unauthorized");
				JsonUtil.writeJsonResponse(response, jsonResponse);
				return;
			}

			jsonResponse.put("isLogged", true);
			jsonResponse.put("totalBalance", pdao.getTotalBalance());
			jsonResponse.put("totalTransactionAmount", pdao.getTotalTransactionAmount());
			jsonResponse.put("totalTransactionCount", pdao.getTotalTransactionCount());
			jsonResponse.put("successfulTransactionCount", pdao.getSuccessfulTransactionCount());

			// Top phương thức thanh toán
			JSONArray topMethods = new JSONArray(pdao.getTopPaymentMethods(5));
			jsonResponse.put("topPaymentMethods", topMethods);

			// Giao dịch gần nhất
			List<Map<String, Object>> transactions = pdao.getRecentTransactions(10);
			JSONArray recentTx = new JSONArray();
			for (Map<String, Object> tx : transactions) {
				recentTx.put(new JSONObject(tx));
			}
			jsonResponse.put("recentTransactions", recentTx);

			// Top user theo số dư
			List<Map<String, Object>> topUsers = pdao.getTopUsersByBalance(10);

			JSONArray topBalances = new JSONArray();
			for (Map<String, Object> user : topUsers) {
				topBalances.put(new JSONObject(user));
			}
			jsonResponse.put("topUsersByBalance", topBalances);

			// Doanh thu theo tháng
			Map<String, BigDecimal> monthlyRevenue = pdao.getMonthlyRevenue();
			JSONObject monthRev = new JSONObject();
			for (Map.Entry<String, BigDecimal> entry : monthlyRevenue.entrySet()) {
				monthRev.put(entry.getKey(), entry.getValue());
			}
			jsonResponse.put("monthlyRevenue", monthRev);

			// Doanh thu theo tuần
			Map<String, BigDecimal> weeklyRevenue = pdao.getWeeklyRevenue();
			JSONObject weekRev = new JSONObject();
			for (Map.Entry<String, BigDecimal> entry : weeklyRevenue.entrySet()) {
				weekRev.put(entry.getKey(), entry.getValue());
			}
			jsonResponse.put("weeklyRevenue", weekRev);

			// Top người chi tiêu nhiều nhất
			List<Map<String, Object>> topSpenders = pdao.getTopSpenders(5);
			JSONArray spenderArray = new JSONArray();
			for (Map<String, Object> spender : topSpenders) {
				spenderArray.put(new JSONObject(spender));
			}
			jsonResponse.put("topSpenders", spenderArray);

			// ARPU
			jsonResponse.put("arpu", pdao.getARPU());

			// LTV
			jsonResponse.put("ltv", pdao.getLTV());

			// Tỷ lệ chuyển đổi user -> trả phí
			jsonResponse.put("userConversionRate", pdao.getUserConversionRate());

			// Số lượng user đã từng trả tiền
			jsonResponse.put("usersWithPayment", pdao.getUsersWithPayment());

			// Phân phối giao dịch theo giá trị
			Map<String, Integer> txDist = pdao.getTransactionValueDistribution();
			JSONObject distJson = new JSONObject();
			for (Map.Entry<String, Integer> entry : txDist.entrySet()) {
				distJson.put(entry.getKey(), entry.getValue());
			}
			jsonResponse.put("transactionValueDistribution", distJson);
			// Lấy user nạp nhiều tiền nhất
			Map<String, Object> topUserAmount = pdao.getTopUserByTotalAmount();
			jsonResponse.put("topUserByTotalAmount", new JSONObject(topUserAmount));

// Lấy phương thức thanh toán phổ biến nhất
			String topPaymentMethod = pdao.getTopPaymentMethod();
			jsonResponse.put("topPaymentMethod", topPaymentMethod);

// Lấy tháng có tổng giao dịch cao nhất
			String topTransactionMonth = pdao.getTopTransactionMonth();
			jsonResponse.put("topTransactionMonth", topTransactionMonth);

// Lấy giao dịch có số tiền cao nhất
			Map<String, Object> topTransaction = pdao.getTopTransaction();
			jsonResponse.put("topTransaction", new JSONObject(topTransaction));

			// ✅ Hoàn tất
			JsonUtil.writeJsonResponse(response, jsonResponse);
		} catch (Exception e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			jsonResponse.put("error", "Server error");
			JsonUtil.writeJsonResponse(response, jsonResponse);
		} finally {
			pdao.closeConnection();
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
		processRequest(request, response);
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
