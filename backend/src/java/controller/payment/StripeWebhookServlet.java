/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.payment;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import dal.TransactionDAO;
import dal.WalletDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import validation.EnvConfig;

@WebServlet(name = "StripeWebhookServlet", urlPatterns = {"/api/payment/stripe/webhook"})
public class StripeWebhookServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(StripeWebhookServlet.class.getName());
    private static final Set<String> processedEvents = ConcurrentHashMap.newKeySet();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String payload = readBody(request);
        String sigHeader = request.getHeader("Stripe-Signature");
        EnvConfig configReader = new EnvConfig();
        String webhookSecret = configReader.getProperty("stripe_webhook_secret");

        if (webhookSecret == null || webhookSecret.isEmpty()) {
            LOGGER.severe("❌ Webhook secret không được cấu hình.");
            response.setStatus(500);
            return;
        }

        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);

            if (processedEvents.contains(event.getId())) {
                LOGGER.info("Đã xử lý event này rồi: " + event.getId());
                response.setStatus(200);
                return;
            }

            if ("checkout.session.completed".equals(event.getType())) {
                LOGGER.info("=== [Stripe] checkout.session.completed ===");
                LOGGER.info("Event ID: " + event.getId());

                Optional<StripeObject> opt = event.getDataObjectDeserializer().getObject();
                String sessionId = "";
                String userIdStr = "";
                BigDecimal amountUSD;

                if (opt.isPresent()) {
                    Session session = (Session) opt.get();
                    sessionId = session.getId();
                    userIdStr = session.getMetadata().get("userId");
                    amountUSD = new BigDecimal(session.getAmountTotal()).divide(new BigDecimal("100"));
                } else {
                    LOGGER.warning("⚠ Không parse được StripeObject, fallback parse JSON.");

                    String rawJson = event.getDataObjectDeserializer().getRawJson();
                    CheckoutSessionPartial parsed = new Gson().fromJson(rawJson, CheckoutSessionPartial.class);

                    if (parsed == null || parsed.metadata == null || parsed.metadata.get("userId") == null) {
                        LOGGER.warning("⚠ Metadata không hợp lệ.");
                        response.setStatus(400);
                        return;
                    }

                    sessionId = parsed.id;
                    userIdStr = parsed.metadata.get("userId");
                    amountUSD = new BigDecimal(parsed.amount_total).divide(new BigDecimal("100"));
                }

                int userId = Integer.parseInt(userIdStr);
                BigDecimal amountVND = amountUSD.multiply(new BigDecimal("25000"));

                LOGGER.info("userId = " + userId);
                LOGGER.info("amount = $" + amountUSD + " ~ " + amountVND + " VND");

                TransactionDAO transactionDAO = new TransactionDAO();
                WalletDAO walletDAO = new WalletDAO();

                transactionDAO.insertTransaction(
                        userId, amountUSD, "Nạp tiền vào tài khoản", "stripe", "USD", "Stripe session ID: " + sessionId);
                walletDAO.addBalance(userId, amountVND);

                processedEvents.add(event.getId());
                LOGGER.info("✅ Ghi nhận thanh toán thành công cho userId = " + userId);
            } else {
                LOGGER.info("Bỏ qua event loại: " + event.getType());
            }

            response.setStatus(200);
        } catch (SignatureVerificationException e) {
            LOGGER.warning("❌ Webhook signature không hợp lệ: " + e.getMessage());
            response.setStatus(400);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "❌ Lỗi xử lý webhook", e);
            response.setStatus(500);
        }
    }

    private String readBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        byte[] buffer = new byte[1024];
        int bytesRead;
        try (var inputStream = request.getInputStream()) {
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                sb.append(new String(buffer, 0, bytesRead, "UTF-8"));
            }
        }
        return sb.toString();
    }

    private static class CheckoutSessionPartial {
        String id;
        Long amount_total;
        Map<String, String> metadata;
    }
}