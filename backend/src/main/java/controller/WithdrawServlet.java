/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.ArtistInfoDAO;
import dal.EsscorsDAO;
import dal.TransactionDAO;
import dal.WalletDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.math.BigDecimal;
import org.json.JSONObject;
import util.PayoutUtils;
import util.SessionUtil;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "WithdrawServlet", urlPatterns = {"/api/withdraw"})
public class WithdrawServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
        JSONObject json = new JSONObject();
        if (userId == null || userId == 0) {
            json.put("success", false);
            json.put("message", "Lỗi phiên đăng nhập vui lòng đăng nhập lại");
            return;
        }

        BufferedReader reader = request.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject reqBody = new JSONObject(sb.toString());
        int amount = reqBody.optInt("amount", 0);

        ArtistInfoDAO artInfoDao = new ArtistInfoDAO();
        WalletDAO walletDao = new WalletDAO();
        EsscorsDAO esscorsDao = new EsscorsDAO();
        int userMoneyLimit = artInfoDao.getDailySpent(userId);
        BigDecimal userMoney = walletDao.getBalance(userId);
        BigDecimal totalPending = esscorsDao.getTotalSpentByUser(userId);
        
        if (userMoneyLimit < amount) {
            json.put("success", false);
            json.put("message", "Vượt quá hạn mức rút tiền trong ngày.");
            response.getWriter().write(json.toString());
            return;
        }

        if (userMoney.subtract(totalPending).compareTo(BigDecimal.valueOf(amount)) < 0) {
            json.put("success", false);
            json.put("message", "Tài khoản không đủ sau khi trừ tiền đang đóng băng.");
            response.getWriter().write(json.toString());
            return;
        }
        
        boolean reduced = artInfoDao.reduceDailySpent(userId, amount);
        if (!reduced) {
            json.put("success", false);
            json.put("message", "Không thể cập nhật hạn mức.");
            response.getWriter().write(json.toString());
            return;
        }
        
        
        String stripeAccountId = artInfoDao.getStripeAccountId(userId);
        boolean payout = PayoutUtils.payoutToConnectedAccount(stripeAccountId, amount, "Withdraw to Stripe");

        TransactionDAO txnDao = new TransactionDAO();
        txnDao.insertTransaction(
                userId,
                new java.math.BigDecimal(amount),
                "success",
                "bank",
                "VND",
                "withdraw",
                "Rút tiền từ hệ thống về tài khoản ngân hàng"
        );
        
        boolean deductFromWallet = walletDao.deductFromWallet(userId, BigDecimal.valueOf(amount));

        json.put("success", true);
        json.put("message", "Rút tiền thành công.");
        
        artInfoDao.closeConnection();
        walletDao.closeConnection();
        txnDao.closeConnection();
        esscorsDao.closeConnection();
        response.getWriter().write(json.toString());
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
