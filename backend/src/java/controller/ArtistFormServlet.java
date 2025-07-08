/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.ArtistInfoDAO;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import org.json.JSONObject;
import util.SessionUtil;
import java.security.SecureRandom;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "ArtistFormServlet", urlPatterns = {"/api/artist/register"})
public class ArtistFormServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        JSONObject json = new JSONObject();
        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));

        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        JSONObject body = new JSONObject(sb.toString());
        int step = body.optInt("step", -1);

        try {
            switch (step) {
                case 3:
                    sendPhoneOTP(request, response, body);
                    break;
                case 4:
                    validateOTP(request, response, body);
                    break;
                case 8:
                    saveArtistInfo(request, response, body);
                    break;
                default:
                    json.put("success", false);
                    json.put("message", "Invalid step.");
                    response.getWriter().write(json.toString());
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.put("success", false);
            json.put("message", "Internal server error.");
            response.getWriter().write(json.toString());
        }
    }

    private void sendPhoneOTP(HttpServletRequest request, HttpServletResponse response, JSONObject body) throws IOException {
        JSONObject json = new JSONObject();

        String otp = generateOtp();
        String phoneNumber = body.optString("phoneNumber", "");
        String sid = util.PhoneOtpSender.sendOtp(phoneNumber, otp);

        if (sid != null) {
            json.put("success", true);
            json.put("message", "OTP sent to phone");
            HttpSession session = request.getSession(false);
            session.setAttribute("OTP", otp);
        } else {
            json.put("success", false);
            json.put("message", "Failed to send OTP");
        }

        response.getWriter().write(json.toString());
    }

    private void validateOTP(HttpServletRequest request, HttpServletResponse response, JSONObject body) throws IOException {
        JSONObject json = new JSONObject();

        HttpSession session = request.getSession(false);
        String systemOTP = (String) session.getAttribute("OTP");
        String userOTP = body.optString("otp");

        if (systemOTP.equals(userOTP)) {
            json.put("success", true);
            json.put("message", "OTP true");
        } else {
            json.put("success", false);
            json.put("message", "OTP wrong");
        }

        response.getWriter().write(json.toString());
    }

    private void saveArtistInfo(HttpServletRequest request, HttpServletResponse response, JSONObject body) throws IOException {
        JSONObject json = new JSONObject();
        ArtistInfoDAO artistInfoDao = new ArtistInfoDAO();

        String phoneNumber = body.optString("phoneNumber", "");
        String address = body.optString("address", "");
        String specialty = body.optString("specialty", "");
        int experienceYears = body.optInt("experienceYears", 0);

        Integer userID = SessionUtil.getCurrentUserId(request.getSession(false));

        boolean success = artistInfoDao.insertArtistInfo(userID, phoneNumber, address, specialty, experienceYears);

        if (success) {
            json.put("success", true);
            json.put("message", "Artist info saved.");
        } else {
            json.put("success", false);
            json.put("message", "Failed to insert artist info.");
        }
        
        response.getWriter().write(json.toString());
    }

    private String generateOtp() {
        SecureRandom secureRandom = new SecureRandom();
        int otp = secureRandom.nextInt(1_000_000);
        return String.format("%06d", otp);
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
