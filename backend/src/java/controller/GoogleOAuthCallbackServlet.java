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

        if (error != null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(new JSONObject().put("error", error).toString());
            return;
        }

        if (code == null || code.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(new JSONObject().put("error", "Thiếu authensition code.").toString());
            return;
        }

        try {
            URL url = new URL("https://oauth2.googleapis.com/token");
            HttpURLConnection connect = (HttpURLConnection) url.openConnection();
            connect.setRequestMethod("POST");
            connect.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connect.setDoOutput(true);

            String data = "code=" + URLEncoder.encode(code, StandardCharsets.UTF_8.toString())
                    + "&client_id=" + CLIENT_ID_GOOGLE
                    + "&client_secret=" + CLIENT_SECRET_GOOGLE
                    + "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI_GOOGLE, StandardCharsets.UTF_8.toString())
                    + "&grant_type=authorization_code";

            try (OutputStream os = connect.getOutputStream()) {
                os.write(data.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            int responseCode = connect.getResponseCode();

            if (responseCode != 200) {
                StringBuilder errorResponse = new StringBuilder();
                try (BufferedReader errorReader = new BufferedReader(new InputStreamReader(connect.getErrorStream(), StandardCharsets.UTF_8))) {
                    String line;
                    while ((line = errorReader.readLine()) != null) {
                        errorResponse.append(line);
                    }
                }

                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(new JSONObject().put("error", "Token exchange failed").put("details", errorResponse.toString()).toString());
                return;
            }

            StringBuilder token = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(connect.getInputStream(), StandardCharsets.UTF_8))) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    token.append(inputLine);
                }
            }

            JSONObject tokenJson = new JSONObject(token.toString());
            String accessToken = tokenJson.getString("access_token");

            URL userInfoUrl = new URL("https://www.googleapis.com/oauth2/v2/userinfo");
            HttpURLConnection userInfoConn = (HttpURLConnection) userInfoUrl.openConnection();
            userInfoConn.setRequestMethod("GET");
            userInfoConn.setRequestProperty("Authorization", "Bearer " + accessToken);

            StringBuilder userInfo = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(userInfoConn.getInputStream(), StandardCharsets.UTF_8))) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    userInfo.append(inputLine);
                }
            }

            JSONObject userInfoJson = new JSONObject(userInfo.toString());

            HttpSession session = request.getSession();
            session.setAttribute("userEmail", userInfoJson.getString("email"));
            session.setAttribute("userName", userInfoJson.getString("name"));
            session.setAttribute("userInfo", userInfoJson.toString());

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(userInfoJson.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(new JSONObject().put("error", e.getMessage()).toString());
        }
    }
}
