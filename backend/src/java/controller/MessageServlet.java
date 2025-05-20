package controller;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.PrintWriter;
import org.json.JSONObject;

@WebServlet(name = "MessageServlet", urlPatterns = { "/api/message" })
public class MessageServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Read request body
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        // Parse JSON
        JSONObject jsonRequest = new JSONObject(sb.toString());
        String message = jsonRequest.getString("message");

        // Process message
        String serverResponse = "Received: " + message;

        // Send response
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", serverResponse);

        PrintWriter out = response.getWriter();
        out.print(jsonResponse.toString());
        out.flush();
    }
}
