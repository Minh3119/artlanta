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
import org.json.JSONObject;
import util.SessionUtil;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "CheckUseEKYCservlet", urlPatterns = {"/api/check/eKYC"})
public class CheckUseEKYCservlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        
        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
        ArtistInfoDAO artistInfoDao = new ArtistInfoDAO();
        JSONObject json = new JSONObject();
        
        if (userId == null) {
            json.put("isKYC", false);
            response.getWriter().write(json.toString());
            return;
        }
        
        boolean isArtistEKYCVerified = artistInfoDao.isArtistEKYCVerified(userId);
        if (isArtistEKYCVerified) {
            json.put("isKYC", true);
        } else {
            json.put("isKYC", false);
        }
        
        response.getWriter().write(json.toString());
    }
    
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
