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

import org.json.JSONArray;
import org.json.JSONObject;
import util.EnvReader;

@WebServlet("/api/create-paypal-order")
public class CreatePaypalOrderServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        
        String fullPath = getServletContext().getRealPath("/WEB-INF/config.properties");
        EnvReader.loadEnv(fullPath);
        
        String paypalClientID = EnvReader.getEnv("paypal_client_id");
        String paypalSercet = EnvReader.getEnv("paypal_sercet");
        String paypalBaseURL = EnvReader.getEnv("paypal_base_url"); 
        
        String accessToken = getAccessToken(paypalClientID,paypalSercet,paypalBaseURL);
        if (accessToken == null) {
            resp.setStatus(500);
            resp.getWriter().write("{\"error\": \"Failed to get access token\"}");
            return;
        }

        // Bước 2: Gửi request tạo order
        String approvalUrl = createOrderAndGetApprovalUrl(accessToken,paypalBaseURL);

        if (approvalUrl != null) {
            JSONObject responseJson = new JSONObject();
            responseJson.put("approvalUrl", approvalUrl);
            resp.getWriter().write(responseJson.toString());
        } else {
            resp.setStatus(500);
            resp.getWriter().write("{\"error\": \"Failed to create order\"}");
        }
    }
    
    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
    }

    private String getAccessToken(String clientID, String paypalSercet, String baseURL) throws IOException {
        URL url = new URL(baseURL + "/v1/oauth2/token");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        String auth = clientID + ":" + paypalSercet;
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

    private String createOrderAndGetApprovalUrl(String accessToken,String baseURL) throws IOException {
        URL url = new URL(baseURL + "/v2/checkout/orders");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        JSONObject body = new JSONObject();
        body.put("intent", "CAPTURE");

        JSONObject amount = new JSONObject();
        amount.put("currency_code", "USD");
        amount.put("value", "10.00");

        JSONObject purchaseUnit = new JSONObject();
        purchaseUnit.put("amount", amount);

        JSONArray purchaseUnits = new JSONArray();
        purchaseUnits.put(purchaseUnit);

        body.put("purchase_units", purchaseUnits);

        JSONObject appContext = new JSONObject();
        appContext.put("return_url", "http://localhost:3000/payment-success");
        appContext.put("cancel_url", "http://localhost:3000/payment-cancel");

        body.put("application_context", appContext);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.toString().getBytes());
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) sb.append(line);

        JSONObject json = new JSONObject(sb.toString());
        JSONArray links = json.getJSONArray("links");

        for (int i = 0; i < links.length(); i++) {
            JSONObject link = links.getJSONObject(i);
            if ("approve".equals(link.getString("rel"))) {
                return link.getString("href");
            }
        }
        return null;
    }
    
    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}