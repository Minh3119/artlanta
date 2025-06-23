import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.logging.Logger;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import util.SessionUtil;
import validation.EnvConfig;

@WebServlet(name = "ZaloPayGatewayServlet", urlPatterns = {"/api/payment/zalopay/create"})
public class ZaloPayGatewayServlet extends HttpServlet {

    private static final Logger logger = Logger.getLogger(ZaloPayGatewayServlet.class.getName());

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JsonObject result = new JsonObject();

        try {
            // Load config
            EnvConfig configReader = new EnvConfig();
            String appId = configReader.getProperty("zalo_appID");
            String key1 = configReader.getProperty("zalo_Key1");
            String endPoint = "https://sb-openapi.zalopay.vn/v2/create"; // Gateway endpoint

            // Parse request
            JsonObject json = JsonParser.parseReader(new BufferedReader(new InputStreamReader(request.getInputStream())))
                    .getAsJsonObject();
            int amount = json.get("amount").getAsInt();
            int userId = SessionUtil.getCurrentUserId(request.getSession(false));

            if (userId == -1) {
                result.addProperty("error", "User not logged in");
                response.getWriter().write(result.toString());
                return;
            }

            if (amount < 10000) {
                result.addProperty("error", "Amount must be at least 10,000 VND");
                response.getWriter().write(result.toString());
                return;
            }

            // Generate transaction ID theo định dạng chuẩn
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyMMdd");
            String app_trans_id = dateFormat.format(new Date()) + "_" + appId + "_" + System.currentTimeMillis();

            String app_user = String.valueOf(userId);
            String embed_data = "{}";
            String item = "[]";
            long app_time = System.currentTimeMillis();
            String callback_url = "http://localhost:9999/backend/api/payment/zalopay/callback";

            // Build data for MAC
            String data = appId + "|" + app_trans_id + "|" + app_user + "|" + amount + "|" + app_time + "|" + embed_data + "|" + item;
            String mac = hmacSHA256(data, key1);

            // Prepare order
            JsonObject order = new JsonObject();
            order.addProperty("app_id", Integer.parseInt(appId));
            order.addProperty("app_trans_id", app_trans_id);
            order.addProperty("app_user", app_user);
            order.addProperty("amount", amount);
            order.addProperty("app_time", app_time);
            order.addProperty("embed_data", embed_data);
            order.addProperty("item", item);
            order.addProperty("description", "Nạp tiền cho user " + userId);

            // 💥 Gateway payment: để bank_code rỗng (Zalo sẽ hiển thị danh sách ngân hàng)
            order.addProperty("bank_code", ""); // ✅ để rỗng là quan trọng

            order.addProperty("callback_url", callback_url);
            order.addProperty("mac", mac);

            JsonObject responseJson = sendCreateOrderRequest(order, endPoint);

            if (responseJson.get("return_code").getAsInt() == 1) {
                // Redirect URL tới gateway
                String paymentUrl = responseJson.get("order_url").getAsString();
                result.addProperty("paymentUrl", paymentUrl);
            } else {
                result.addProperty("error", responseJson.get("return_message").getAsString());
            }

        } catch (Exception e) {
            result.addProperty("error", "Server error: " + e.getMessage());
            e.printStackTrace();
        }

        response.getWriter().write(result.toString());
    }

    private JsonObject sendCreateOrderRequest(JsonObject order, String endPoint) throws IOException {
        URL url = new URL(endPoint);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = order.toString().getBytes(StandardCharsets.UTF_8);
            os.write(input);
        }

        try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            return JsonParser.parseReader(in).getAsJsonObject();
        }
    }

    private String hmacSHA256(String data, String key) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            hmac.init(secretKey);
            byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Credentials", "true");
    }
}