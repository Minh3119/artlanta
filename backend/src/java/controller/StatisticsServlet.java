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
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import util.SessionUtil;

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
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        // Check for session or authentication
        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Unauthorized: session not found\"}");
            return;
        }

        JSONObject json = new JSONObject();

        try (PrintWriter out = response.getWriter()) {
            StatisticsDAO statsDAO = new StatisticsDAO();
            Statistics stats = statsDAO.getUserStatistics(userId);

            json.put("posts", stats.getPosts());
            json.put("followers", stats.getFollowers());
            json.put("following", stats.getFollowing());
            json.put("likesReceived", stats.getLikesReceived());
            json.put("commentsMade", stats.getCommentsMade());
            json.put("repliesReceived", stats.getRepliesReceived());
            json.put("commentsPerPost", stats.getCommentsPerPost());
            json.put("votesPerPost", stats.getVotesPerPost());

            // Add top posts
            var topPosts = statsDAO.getTopPosts(userId);
            org.json.JSONArray topPostsArr = new org.json.JSONArray();
            for (var tp : topPosts) {
                JSONObject postJson = new JSONObject();
                postJson.put("postId", tp.getID());
                postJson.put("userId", tp.getUserID());
                postJson.put("title", tp.getTitle()); // Add the title to the JSON response
                postJson.put("likeInteractions", tp.getLikeInteractions());
                postJson.put("commentInteractions", tp.getCommentInteractions());
                postJson.put("totalInteractions", tp.getTotalInteractions());
                topPostsArr.put(postJson);
            }
            json.put("topPosts", topPostsArr);

            // Add top commenters
            var topUsers = statsDAO.getTopCommenters(userId);
            org.json.JSONArray topUsersArr = new org.json.JSONArray();
            for (var tu : topUsers) {
                JSONObject userJson = new JSONObject();
                userJson.put("userId", tu.getID());
                userJson.put("username", tu.getUsername()); // Add username to the JSON response
                userJson.put("likeInteractions", tu.getLikeInteractions());
                userJson.put("commentInteractions", tu.getCommentInteractions());
                userJson.put("totalInteractions", tu.getTotalInteractions());
                topUsersArr.put(userJson);
            }
            json.put("topCommenters", topUsersArr);

            out.write(json.toString());
            statsDAO.closeConnection();
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
