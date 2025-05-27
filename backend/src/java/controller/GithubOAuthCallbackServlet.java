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
/**
 *
 * @author admin
 */
@WebServlet(name = "GithubOAuthCallbackServlet", urlPatterns = {"/api/oauth2callbackgithub"})
public class GithubOAuthCallbackServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String fullPath = getServletContext().getRealPath("/WEB-INF/env.txt");
        EnvReader.loadEnv(fullPath);

        String CLIENT_ID_GITHUB = EnvReader.getEnv("CLIENT_ID_GITHUB");
        String CLIENT_SECRET_GITHUB = EnvReader.getEnv("CLIENT_SECRET_GITHUB");
        String REDIRECT_URI_GITHUB = EnvReader.getEnv("REDIRECT_URI_GITHUB");

        response.setContentType("application/json; charset=UTF-8");
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
            response.getWriter().write(new JSONObject().put("error", "Thiếu authentication code.").toString());
            return;
        }

        HttpURLConnection conn = null;
        HttpURLConnection userConn = null;
        try {
            URL url = new URL("https://github.com/login/oauth/access_token");
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Accept", "application/json");
            conn.setDoOutput(true);

            String data = "client_id=" + CLIENT_ID_GITHUB
                    + "&client_secret=" + CLIENT_SECRET_GITHUB
                    + "&code=" + URLEncoder.encode(code, StandardCharsets.UTF_8)
                    + "&redirect_uri=" + URLEncoder.encode(REDIRECT_URI_GITHUB, StandardCharsets.UTF_8);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(data.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(new JSONObject().put("error", "Token exchange failed").toString());
                return;
            }

            StringBuilder tokenResponse = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = in.readLine()) != null) {
                    tokenResponse.append(line);
                }
            }

            JSONObject tokenJson = new JSONObject(tokenResponse.toString());
            String accessToken = tokenJson.getString("access_token");

            URL userInfoUrl = new URL("https://api.github.com/user");
            userConn = (HttpURLConnection) userInfoUrl.openConnection();
            userConn.setRequestMethod("GET");
            userConn.setRequestProperty("Authorization", "token " + accessToken);

            int userResponseCode = userConn.getResponseCode();
            if (userResponseCode != 200) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(new JSONObject().put("error", "Failed to fetch user info").toString());
                return;
            }

            StringBuilder userInfo = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(userConn.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = in.readLine()) != null) {
                    userInfo.append(line);
                }
            }

            JSONObject userJson = new JSONObject(userInfo.toString());

            HttpSession session = request.getSession();
            session.setAttribute("userLogin", userJson.getString("login"));
            session.setAttribute("userName", userJson.optString("name"));
            session.setAttribute("avatarUrl", userJson.optString("avatar_url"));
            session.setAttribute("userInfo", userJson.toString());

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(userJson.toString());

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(new JSONObject().put("error", e.getMessage()).toString());
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
            if (userConn != null) {
                userConn.disconnect();
            }
        }
    }
}
