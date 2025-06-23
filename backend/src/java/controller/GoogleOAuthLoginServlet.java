package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import model.User;
import org.json.JSONObject;
import util.EnvReader;
import util.SessionUtil;
import dal.UserDAO;
import validation.EnvConfig;

@WebServlet(name = "GoogleOAuthLoginServlet", urlPatterns = {"/api/oauth2callbackgoogle"})
public class GoogleOAuthLoginServlet extends HttpServlet {            
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCORSHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String code = request.getParameter("code");
        String error = request.getParameter("error");

        if (error != null || code == null || code.isEmpty()) {
            response.sendRedirect("http://localhost:3000" + "/login?error=oauth_failed");
            return;
        }

        try {
            EnvConfig configReader = new EnvConfig();

            String clientId = configReader.getProperty("CLIENT_ID_GOOGLE");
            String clientSecret = configReader.getProperty("CLIENT_SECRET_GOOGLE");
            String redirectUri = configReader.getProperty("REDIRECT_URI_GOOGLE");

            String accessToken = exchangeCodeForAccessToken(code, clientId, clientSecret, redirectUri);
            if (accessToken == null) {
                response.sendRedirect("http://localhost:3000" + "/login?error=token_exchange_failed");
                return;
            }

            JSONObject userInfo = getUserInfoFromGoogle(accessToken);
            if (userInfo == null) {
                response.sendRedirect("http://localhost:3000" + "/login?error=user_info_failed");
                return;
            }

            String email = userInfo.optString("email");
            String name = userInfo.optString("name");

            UserDAO userDao = new UserDAO();
            if (!userDao.checkUserExistsByEmail(email)) {
                String password = generateRandomPassword(10);
                userDao.registerUser(name, email, password);
            }

            User user = userDao.getUserByEmail(email);
            HttpSession session = request.getSession(true);
            SessionUtil.storeUserInSession(session, user.getID());

            response.sendRedirect("http://localhost:3000" + "/");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000" + "/login?error=internal_error");
        }
    }

    private String exchangeCodeForAccessToken(String code, String clientId, String clientSecret, String redirectUri) throws IOException {
        URL url = new URL("https://oauth2.googleapis.com/token");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setDoOutput(true);

        String data = "code=" + URLEncoder.encode(code, StandardCharsets.UTF_8)
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&redirect_uri=" + URLEncoder.encode(redirectUri, StandardCharsets.UTF_8)
                + "&grant_type=authorization_code";

        try (OutputStream os = conn.getOutputStream()) {
            os.write(data.getBytes(StandardCharsets.UTF_8));
        }

        if (conn.getResponseCode() != 200) {
            return null;
        }

        StringBuilder response = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        }

        JSONObject tokenJson = new JSONObject(response.toString());
        return tokenJson.optString("access_token", null);
    }

    private JSONObject getUserInfoFromGoogle(String accessToken) throws IOException {
        URL url = new URL("https://www.googleapis.com/oauth2/v2/userinfo");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);

        if (conn.getResponseCode() != 200) return null;

        StringBuilder response = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
        }

        return new JSONObject(response.toString());
    }

    private String generateRandomPassword(int length) {
        String charPossible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(charPossible.length());
            sb.append(charPossible.charAt(index));
        }
        return sb.toString();
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
