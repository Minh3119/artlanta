/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.Payment;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;

import org.json.JSONObject;
import util.EnvReader;

@WebServlet("/api/capture-paypal-order")
public class CapturePaypalOrderServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        
        String fullPath = getServletContext().getRealPath("/WEB-INF/config.properties");
        EnvReader.loadEnv(fullPath);
        
        String paypalClientID = EnvReader.getEnv("paypal_client_id");
        String paypalSercet = EnvReader.getEnv("paypal_sercet");
        String paypalBaseURL = EnvReader.getEnv("paypal_base_url"); 
        
        String orderId = req.getParameter("token");

        if (orderId == null || orderId.isEmpty()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\": \"Missing order token\"}");
            return;
        }

        String accessToken = getAccessToken(paypalClientID,paypalSercet,paypalBaseURL);
        if (accessToken == null) {
            resp.setStatus(500);
            resp.getWriter().write("{\"error\": \"Failed to get access token\"}");
            return;
        }

        JSONObject result = captureOrder(orderId, accessToken,paypalBaseURL);

        if (result != null) {
            resp.getWriter().write(result.toString());
        } else {
            resp.setStatus(500);
            resp.getWriter().write("{\"error\": \"Failed to capture order\"}");
        }
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
    }

    private String getAccessToken(String clientID, String secretID, String baseUrl) throws IOException {
        URL url = new URL(baseUrl + "/v1/oauth2/token");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        String auth = clientID + ":" + secretID;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes());

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Basic " + encodedAuth);
        conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        conn.setDoOutput(true);

        try (OutputStream os = conn.getOutputStream()) {
            os.write("grant_type=client_credentials".getBytes());
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);

        JSONObject json = new JSONObject(sb.toString());
        return json.optString("access_token", null);
    }

    private JSONObject captureOrder(String orderId, String accessToken, String baseURL) throws IOException {
        URL url = new URL(baseURL + "/v2/checkout/orders/" + orderId + "/capture");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        int status = conn.getResponseCode();
        InputStream stream = (status >= 200 && status < 300) ? conn.getInputStream() : conn.getErrorStream();

        BufferedReader reader = new BufferedReader(new InputStreamReader(stream));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);

        return new JSONObject(sb.toString());
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}