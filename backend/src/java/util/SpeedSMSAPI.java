package util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class SpeedSMSAPI {
    public static final String API_URL = "https://api.speedsms.vn/index.php";
    protected String mAccessToken;

    public SpeedSMSAPI(String accessToken) {
        this.mAccessToken = accessToken;
    }

    /**
     * Lấy thông tin tài khoản SpeedSMS
     */
    public String getUserInfo() throws IOException {
        URL url = new URL(API_URL + "/user/info");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");

        String userCredentials = mAccessToken + ":x";
        String basicAuth = "Basic " + Base64.getEncoder().encodeToString(userCredentials.getBytes(StandardCharsets.UTF_8));
        conn.setRequestProperty("Authorization", basicAuth);

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder buffer = new StringBuilder();
        String inputLine;

        while ((inputLine = in.readLine()) != null) {
            buffer.append(inputLine);
        }
        in.close();

        return buffer.toString();
    }

    /**
     * Gửi SMS (OTP / Notify / Marketing)
     * @param to số điện thoại đích (84xxxxxxxxx)
     * @param content nội dung tin nhắn
     * @param type 1 = marketing, 2 = otp, 3 = notify
     * @param sender brand name (để trống nếu không dùng)
     * @return phản hồi dạng JSON string
     */
    public String sendSMS(String to, String content, int type, String sender) throws IOException {
        String json = String.format(
            "{\"to\": [\"%s\"], \"content\": \"%s\", \"type\": %d, \"brandname\": \"%s\"}",
            to, encodeNonAsciiCharacters(content), type, sender
        );

        URL url = new URL(API_URL + "/sms/send");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");

        String userCredentials = mAccessToken + ":x";
        String basicAuth = "Basic " + Base64.getEncoder().encodeToString(userCredentials.getBytes(StandardCharsets.UTF_8));
        conn.setRequestProperty("Authorization", basicAuth);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        try (DataOutputStream wr = new DataOutputStream(conn.getOutputStream())) {
            wr.writeBytes(json);
            wr.flush();
        }

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder buffer = new StringBuilder();
        String inputLine;

        while ((inputLine = in.readLine()) != null) {
            buffer.append(inputLine);
        }
        in.close();

        return buffer.toString();
    }

    private String encodeNonAsciiCharacters(String value) {
        StringBuilder sb = new StringBuilder();
        for (char c : value.toCharArray()) {
            if (c > 127) {
                sb.append(String.format("\\u%04x", (int) c));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
