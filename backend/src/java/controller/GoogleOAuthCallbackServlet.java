/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;
import util.EnvReader;
import dal.UserDAO;
import model.User;

@WebServlet(name = "GoogleOAuthCallbackServlet", urlPatterns = {"/api/oauth2callbackgoogle"})
public class GoogleOAuthCallbackServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String fullPath = getServletContext().getRealPath("/WEB-INF/env.txt");
        EnvReader.loadEnv(fullPath);

        String CLIENT_ID_GOOGLE = EnvReader.getEnv("CLIENT_ID_GOOGLE");
        String CLIENT_SECRET_GOOGLE = EnvReader.getEnv("CLIENT_SECRET_GOOGLE");
        String REDIRECT_URI_GOOGLE = EnvReader.getEnv("REDIRECT_URI_GOOGLE");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String code = request.getParameter("code");
        String error = request.getParameter("error");

        if (error != null || code == null || code.isEmpty()) {
            response.sendRedirect("http://localhost:3000/login?error=oauth_failed");
            return;
        }

        try {
            // Exchange code for token
            URL tokenUrl = new URL("https://oauth2.googleapis.com/token");
            HttpURLConnection connect = (HttpURLConnection) tokenUrl.openConnection();
            connect.setRequestMethod("POST");
            connect.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connect.setDoOutput(true);

            String data = "code=" + URLEncoder.encode(code, StandardCharsets.UTF_8)
                    + "&client_id=" + CLIENT_ID_GOOGLE
                    + "&client_secret=" + CLIENT_SECRET_GOOGLE
                    + "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI_GOOGLE, StandardCharsets.UTF_8)
                    + "&grant_type=authorization_code";

            try (OutputStream os = connect.getOutputStream()) {
                os.write(data.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            if (connect.getResponseCode() != 200) {
                response.sendRedirect("http://localhost:3000/login?error=token_exchange_failed");
                return;
            }

            StringBuilder tokenResponse = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(connect.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = in.readLine()) != null) {
                    tokenResponse.append(line);
                }
            }

            JSONObject tokenJson = new JSONObject(tokenResponse.toString());
            String accessToken = tokenJson.getString("access_token");

            // Get user info from Google
            URL userInfoUrl = new URL("https://www.googleapis.com/oauth2/v2/userinfo");
            HttpURLConnection userInfoConn = (HttpURLConnection) userInfoUrl.openConnection();
            userInfoConn.setRequestMethod("GET");
            userInfoConn.setRequestProperty("Authorization", "Bearer " + accessToken);

            StringBuilder userInfo = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(userInfoConn.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = in.readLine()) != null) {
                    userInfo.append(line);
                }
            }

            JSONObject userInfoJson = new JSONObject(userInfo.toString());
            String email = userInfoJson.getString("email");
            String name = userInfoJson.getString("name");

            // Check user in database (or insert new user if needed)
//            UserDAO dao = new UserDAO();
//            User user = dao.findUserByEmail(email);
//            if (user == null) {
//                user = dao.createUserFromOAuth(email, name);
//            }

            String frontendRedirect = "http://localhost:3000/oauth-success?email=" + URLEncoder.encode(email, StandardCharsets.UTF_8)
                    + "&name=" + URLEncoder.encode(name, StandardCharsets.UTF_8);
            response.sendRedirect(frontendRedirect);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("http://localhost:3000/login?error=server_error");
        }
    }
}
