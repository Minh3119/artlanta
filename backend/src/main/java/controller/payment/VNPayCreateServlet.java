package controller.payment;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import util.SessionUtil;
import validation.EnvConfig;

@WebServlet(name = "VNPayCreateServlet", urlPatterns = {"/api/payment/vnpay/create"})
public class VNPayCreateServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        EnvConfig config = new EnvConfig();
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String vnpTMNCode = config.getProperty("vnp_TmnCode");
        String vnpHashSecret = config.getProperty("vnp_HashSecret");
        String vnpPayUrl = config.getProperty("vnp_payUrl");
        String vnpReturnUrl = "http://localhost:3000/paymentResult";


        JsonObject json = JsonParser.parseReader(new BufferedReader(new InputStreamReader(request.getInputStream())))
                .getAsJsonObject();
        int amount = json.get("amount").getAsInt();

        int userId = SessionUtil.getCurrentUserId(request.getSession(false));
        if (userId == -1 || amount < 10000) {
            response.getWriter().write("{\"error\":\"Invalid request\"}");
            return;
        }

        String txnRef = UUID.randomUUID().toString();
        String orderInfo = "Nap tien VNPAY cho user " + userId;
        String orderType = "other";

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpTMNCode);
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", orderType);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
        vnpParams.put("vnp_IpAddr", request.getRemoteAddr());
        vnpParams.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String name : fieldNames) {
            String value = vnpParams.get(name);
            if (value != null && !value.isEmpty()) {
                hashData.append(name).append('=').append(URLEncoder.encode(value, "UTF-8")).append('&');
                query.append(name).append('=').append(URLEncoder.encode(value, "UTF-8")).append('&');
            }
        }

        hashData.setLength(hashData.length() - 1);
        query.setLength(query.length() - 1);

        String secureHash = hmacSHA512(vnpHashSecret, hashData.toString());
        query.append("&vnp_SecureHash=").append(secureHash);
        String paymentUrl = vnpPayUrl + "?" + query;

        JsonObject result = new JsonObject();
        result.addProperty("paymentUrl", paymentUrl);
        response.getWriter().write(result.toString());
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash).toUpperCase();
        } catch (Exception e) {
            System.out.println("ERROR in hmacSHA512: " + e.getMessage());
            return null;
        }
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}