/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.StatisticsDAO;
import model.Statistics;
import org.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 *
 * @author nvg
 */
public class StatisticsServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet StatisticsServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet StatisticsServlet at " + request.getContextPath() + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        String userIdParam = request.getParameter("userId");
        JSONObject json = new JSONObject();

        if (userIdParam == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            json.put("error", "Missing userId parameter");
            response.getWriter().write(json.toString());
            return;
        }

        int userId;
        try {
            userId = Integer.parseInt(userIdParam);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            json.put("error", "Invalid userId parameter");
            response.getWriter().write(json.toString());
            return;
        }

        try (PrintWriter out = response.getWriter()) {
            StatisticsDAO statsDAO = new StatisticsDAO(); // No connection passed
            Statistics stats = statsDAO.getUserStatistics(userId);

            json.put("posts", stats.getPosts());
            json.put("followers", stats.getFollowers());
            json.put("following", stats.getFollowing());
            json.put("likesReceived", stats.getLikesReceived());
            json.put("commentsMade", stats.getCommentsMade());
            json.put("repliesReceived", stats.getRepliesReceived());

            out.write(json.toString());
            statsDAO.closeConnection(); // Close connection if needed
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            json.put("error", "Database error: " + e.getMessage());
            response.getWriter().write(json.toString());
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Returns user statistics as JSON";
    }// </editor-fold>

}
