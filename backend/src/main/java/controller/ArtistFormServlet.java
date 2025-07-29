/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.stripe.exception.StripeException;
import dal.ArtistInfoDAO;
import dal.UserDAO;
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
import util.PayoutUtils;

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

        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            json.put("success", false);
            json.put("message", "User not logged in.");
            response.getWriter().write(json.toString());
            return;
        }

        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }
        JSONObject body = new JSONObject(sb.toString());
        int step = body.optInt("currentStep", -1);

        try {
            switch (step) {
                case 7:
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

    private void saveArtistInfo(HttpServletRequest request, HttpServletResponse response, JSONObject body) throws IOException, StripeException {
        JSONObject json = new JSONObject();
        ArtistInfoDAO artistInfoDao = new ArtistInfoDAO();
        UserDAO userDAO = new UserDAO();

        String phoneNumber = body.optString("phoneNumber", "");
        String specialty = body.optString("specialty", "");
        boolean eKYC = false;
        int experienceYears = body.optInt("experienceYears", 0);

        Integer userID = SessionUtil.getCurrentUserId(request.getSession(false));

        boolean success = artistInfoDao.insertArtistInfo(userID, phoneNumber, specialty, experienceYears, eKYC);

        if (success) {
            json.put("success", true);
            json.put("message", "Artist info saved.");

            boolean changeRoleToArtist = userDAO.setUserRoleToArtist(userID);
            String userEmail = userDAO.getOne(userID).getEmail();
            System.out.println("Creating Stripe account for: " + userEmail);
            String stripeAccountId = PayoutUtils.createConnectedAccount(userEmail);
            System.out.println("Stripe account created: " + stripeAccountId);
            boolean updateStripeAccount = artistInfoDao.updateStripeAccountId(userID, stripeAccountId);
            System.out.println("Updated DB with Stripe ID: " + updateStripeAccount);
            
        } else {
            json.put("success", false);
            json.put("message", "Failed to insert artist info.");
        }

        response.getWriter().write(json.toString());
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
