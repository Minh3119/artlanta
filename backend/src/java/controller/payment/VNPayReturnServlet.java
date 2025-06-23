/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.payment;

import com.google.gson.JsonObject;
import dal.TransactionDAO;
import dal.WalletDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.math.BigDecimal;
import util.SessionUtil;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "VNPayReturnServlet", urlPatterns = {"/api/payment/vnpay/return"})
public class VNPayReturnServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_AmountStr = request.getParameter("vnp_Amount");

        JsonObject result = new JsonObject();

        if (vnp_TxnRef == null || vnp_ResponseCode == null || vnp_AmountStr == null) {
            result.addProperty("error", "Missing parameters");
            response.getWriter().write(result.toString());
            return;
        }

        if (!vnp_ResponseCode.equals("00")) {
            result.addProperty("status", "FAILED");
            result.addProperty("message", "Payment was not successful");
            response.getWriter().write(result.toString());
            return;
        }

        int userId = SessionUtil.getCurrentUserId(request.getSession(false));
        if (userId == -1) {
            result.addProperty("error", "Unauthorized");
            response.getWriter().write(result.toString());
            return;
        }

        try {
            BigDecimal amountVND = new BigDecimal(vnp_AmountStr).divide(new BigDecimal(100));
            WalletDAO walletDAO = new WalletDAO();
            TransactionDAO transactionDAO = new TransactionDAO();

            if (transactionDAO.isTxnRefExists(vnp_TxnRef)) {
                result.addProperty("status", "DUPLICATE");
                result.addProperty("message", "Giao dịch đã được xử lý trước đó.");
                response.getWriter().write(result.toString());
                return;
            }

            String description = "Nạp tiền qua VNPAY, txnRef: " + vnp_TxnRef;
            transactionDAO.insertTransaction(userId, amountVND, "Nạp tiền vào tài khoản", "vnpay", "VND", description);
            walletDAO.addBalance(userId, amountVND);

            result.addProperty("status", "PAID");
            result.addProperty("message", "Thanh toán thành công, đã cập nhật ví.");
        } catch (Exception e) {
            result.addProperty("error", "Server error");
            e.printStackTrace();
        }

        response.getWriter().write(result.toString());
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}