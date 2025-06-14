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
import validation.EnvConfig;

@WebServlet("/api/create-paypal-order")
public class CreatePaypalOrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);

        EnvConfig configReader = new EnvConfig();

        String paypalClientID = configReader.getProperty("paypal_client_id");
        String paypalSercet = configReader.getProperty("paypal_sercet");
        String paypalBaseURL = configReader.getProperty("paypal_base_url");

        String accessToken = getAccessToken(paypalClientID, paypalSercet, paypalBaseURL);
        if (accessToken == null) {
            getServletContext().log("Failed to get PayPal token");
            return;
        }

        String approvalUrl = createOrderAndGetApprovalUrl(accessToken, paypalBaseURL, req);

        if (approvalUrl != null) {
            JSONObject responseJson = new JSONObject();
            responseJson.put("approvalUrl", approvalUrl);
            resp.getWriter().write(responseJson.toString());
        } else {
            getServletContext().log("Failed to create order");
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
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        JSONObject json = new JSONObject(sb.toString());
        return json.optString("access_token", null);
    }

    private String createOrderAndGetApprovalUrl(String accessToken, String baseURL, HttpServletRequest req) throws IOException {
        URL url = new URL(baseURL + "/v2/checkout/orders");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        conn.setRequestMethod("POST");
        conn.setRequestProperty("Authorization", "Bearer " + accessToken);
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoOutput(true);

        JSONObject body = new JSONObject();
        body.put("intent", "CAPTURE");

        BufferedReader readerFE = req.getReader();
        StringBuilder bodyString = new StringBuilder();
        String lineFE;
        while ((lineFE = readerFE.readLine()) != null) {
            bodyString.append(lineFE);
        }

        JSONObject requestBody = new JSONObject(bodyString.toString());
        String amountValue = requestBody.optString("amount", "10.00");
        String currencyCode = requestBody.optString("currency", "USD");
        
        JSONObject amount = new JSONObject();
        amount.put("currency_code", currencyCode);
        amount.put("value", amountValue);

        JSONObject purchaseUnit = new JSONObject();
        purchaseUnit.put("amount", amount);

        JSONArray purchaseUnits = new JSONArray();
        purchaseUnits.put(purchaseUnit);

        body.put("purchase_units", purchaseUnits);

        JSONObject appContext = new JSONObject();
        appContext.put("return_url", "http://localhost:3000/payment-success");
        appContext.put("cancel_url", "http://localhost:3000/");

        body.put("application_context", appContext);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(body.toString().getBytes());
        }

        BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

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
