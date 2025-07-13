/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.payment;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import dal.TransactionDAO;
import dal.WalletDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import util.ExchangeRateUtil;
import util.SessionUtil;

@WebServlet(name = "PayPalVerifyServlet", urlPatterns = {"/api/payment/paypal/verify"})
public class PayPalVerifyServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        HttpSession session = request.getSession(false);
        Integer userId = SessionUtil.getCurrentUserId(session);

        JsonObject jsonRes = new JsonObject();

        if (userId == null || userId == 0) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            jsonRes.addProperty("success", false);
            jsonRes.addProperty("message", "Phiên đăng nhập hết hạn.");
            response.getWriter().write(jsonRes.toString());
            return;
        }

        JsonObject requestBody = parseRequestBody(request);
        BigDecimal amountUSD = requestBody.get("amount").getAsBigDecimal();
        String orderID = requestBody.get("orderID").getAsString();

        BigDecimal exchangeRate = ExchangeRateUtil.getUsdToVndRate();
        BigDecimal amountVND = amountUSD.multiply(exchangeRate);

        TransactionDAO transactionDAO = new TransactionDAO();
        WalletDAO walletDAO = new WalletDAO();

        transactionDAO.insertTransaction(
                userId,
                amountUSD,
                "Nạp tiền vào tài khoản",
                "paypal",
                "USD",
                "PayPal order ID: " + orderID
        );

        walletDAO.addBalance(userId, amountVND);

        jsonRes.addProperty("success", true);
        jsonRes.addProperty("message", "Nạp tiền thành công");
        response.getWriter().write(jsonRes.toString());
    }

    private JsonObject parseRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = request.getReader()) {
            String line;
            while ((line = br.readLine()) != null)
                sb.append(line);
        }
        return JsonParser.parseString(sb.toString()).getAsJsonObject();
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true"); 
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}