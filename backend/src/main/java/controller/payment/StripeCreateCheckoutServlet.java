/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.payment;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.stripe.Stripe;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.model.checkout.Session;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import util.SessionUtil;
import validation.EnvConfig;

@WebServlet(name = "StripeCreateCheckoutServlet", urlPatterns = {"/api/payment/stripe/create-checkout-session"})
public class StripeCreateCheckoutServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
            if (userId == null || userId == 0) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"unauthorized\"}");
                return;
            }

            JsonObject body = parseRequestBody(request);
            if (body == null || !body.has("amount")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"missing_amount\"}");
                return;
            }

            BigDecimal amountUSD = body.get("amount").getAsBigDecimal();

            // Validate amount
            if (amountUSD.compareTo(BigDecimal.ZERO) <= 0 || amountUSD.compareTo(new BigDecimal("10000")) > 0) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"error\": \"invalid_amount\"}");
                return;
            }

            long amountCents = amountUSD.multiply(new BigDecimal("100")).longValue();

            EnvConfig configReader = new EnvConfig();
            String stripeSecret = configReader.getProperty("stripe_secret");

            if (stripeSecret == null || stripeSecret.isEmpty()) {
                response.setStatus(500);
                response.getWriter().write("{\"error\": \"configuration_error\"}");
                return;
            }

            Stripe.apiKey = stripeSecret;

            String baseUrl = getBaseUrl(request);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(baseUrl + "/payment-success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(baseUrl + "/payment-cancel")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount(amountCents)
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName("Nạp tiền vào ví - $" + amountUSD)
                                                                    .setDescription("Nạp $" + amountUSD + " vào ví của bạn")
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .putMetadata("userId", String.valueOf(userId))
                    .putMetadata("amountUSD", amountUSD.toString())
                    .setPaymentIntentData(
                            SessionCreateParams.PaymentIntentData.builder()
                                    .putMetadata("userId", String.valueOf(userId))
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);


            JsonObject json = new JsonObject();
            json.addProperty("url", session.getUrl());
            json.addProperty("sessionId", session.getId());
            response.getWriter().write(json.toString());

        } catch (Exception e) {
            response.setStatus(500);
            response.getWriter().write("{\"error\": \"stripe_error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    private String getBaseUrl(HttpServletRequest request) {
        EnvConfig configReader = new EnvConfig();
        String frontendUrl = configReader.getProperty("frontend_url");

        if (frontendUrl != null && !frontendUrl.isEmpty()) {
            return frontendUrl;
        }

        return "http://localhost:3000";
    }

    private JsonObject parseRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String jsonString = sb.toString();
        if (jsonString.isEmpty()) {
            return null;
        }

        try {
            return JsonParser.parseString(jsonString).getAsJsonObject();
        } catch (Exception e) {
            return null;
        }
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
