/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.ArtistInfoDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.ArtistInfo;
import model.User;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "CurrentArtistServlet", urlPatterns = {"/api/currentArtist"})
public class CurrentArtistServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            Integer userId = SessionUtil.getCurrentUserId(request.getSession());

            if (userId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                JsonUtil.writeJsonError(response, "No user logged in");
                return;
            }

            // Get user data from database
            ArtistInfoDAO artistDao = new ArtistInfoDAO();
            ArtistInfo artistInfo = artistDao.getArtistInfoByUserId(userId);
            if (artistInfo != null) {
                JSONObject jsonResponse = new JSONObject();
                JSONObject userJson = new JSONObject();

                // Manually convert User object to JSON
                userJson.put("UserID", artistInfo.getUserId());
                userJson.put("PhoneNumber", artistInfo.getPhoneNumber());
                userJson.put("Specialty", artistInfo.getSpecialty());
                userJson.put("ExperienceYears", artistInfo.getExperienceYears());
                userJson.put("iseKYC", artistInfo.iseKYC());
                jsonResponse.put("response", userJson);
                JsonUtil.writeJsonResponse(response, jsonResponse);
            } else {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                JsonUtil.writeJsonError(response, "User not found");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            JsonUtil.writeJsonError(response, e.getMessage());
        }
    }
}
