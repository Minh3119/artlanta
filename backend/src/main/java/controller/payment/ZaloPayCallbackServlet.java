package controller.payment;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import dal.TransactionDAO;
import dal.WalletDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.logging.Logger;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Hex;
import util.SessionUtil;
import validation.EnvConfig;

@WebServlet(name = "ZaloPayCallbackServlet", urlPatterns = {"/api/payment/zalopay/callback"})
public class ZaloPayCallbackServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(ZaloPayCallbackServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JsonObject result = new JsonObject();

        try {
            // Đọc raw body
            StringBuilder buffer = new StringBuilder();
            String line;
            try (BufferedReader reader = request.getReader()) {
                while ((line = reader.readLine()) != null) {
                    buffer.append(line);
                }
            }
            String jsonStr = buffer.toString();
            logger.info("ZaloPay callback received: " + jsonStr);

            JsonObject callbackData = JsonParser.parseString(jsonStr).getAsJsonObject();
            String dataStr = callbackData.get("data").getAsString();
            String reqMac = callbackData.get("mac").getAsString();

            EnvConfig configReader = new EnvConfig();
            String key2 = configReader.getProperty("zalo_Key2");
            String mac = HMACUtil.encode(HMACUtil.HMACSHA256, key2, dataStr);

            if (!reqMac.equals(mac)) {
                logger.warning("MAC verification failed");
                result.addProperty("return_code", 0);
                result.addProperty("return_message", "mac not equal");
                response.getWriter().write(result.toString());
                return;
            }

            // Parse data object
            JsonObject data = JsonParser.parseString(dataStr).getAsJsonObject();
            String appTransId = data.get("app_trans_id").getAsString();
            int amount = data.get("amount").getAsInt();
            String appUser = data.get("app_user").getAsString();

            logger.info("Processing payment - TransID: " + appTransId + ", Amount: " + amount);

            TransactionDAO transactionDAO = new TransactionDAO();
            if (transactionDAO.isTransactionProcessed(appTransId)) {
                logger.info("Transaction already processed: " + appTransId);
                result.addProperty("return_code", 1);
                result.addProperty("return_message", "success");
                response.getWriter().write(result.toString());
                return;
            }

            int userId = Integer.parseInt(appUser);

            BigDecimal amountVND = new BigDecimal(amount);
            WalletDAO walletDAO = new WalletDAO();

            String description = "Nạp tiền qua ZaloPay - Mã GD: " + appTransId;

            transactionDAO.insertTransaction(
                    userId,
                    amountVND,
                    "success",
                    "zalopay",
                    "VND",
                    "deposit",
                    description
            );

            logger.info("Payment processed successfully for user: " + userId);


            result.addProperty("return_code", 1);
            result.addProperty("return_message", "success");

        } catch (Exception e) {
            logger.severe("Error processing ZaloPay callback: " + e.getMessage());
            e.printStackTrace();

            result.addProperty("return_code", 0);
            result.addProperty("return_message", "error: " + e.getMessage());
        }

        response.getWriter().write(result.toString());
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }

    // Inner class for HMAC utility
    private static class HMACUtil {

        public static final String HMACSHA256 = "HmacSHA256";

        public static String encode(String algorithm, String key, String data) {
            try {
                Mac mac = Mac.getInstance(algorithm);
                SecretKeySpec secret_key = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), algorithm);
                mac.init(secret_key);
                return Hex.encodeHexString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
            } catch (Exception e) {
                throw new RuntimeException("Error while encoding", e);
            }
        }
    }
}
