/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.User;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;

/**
 *
 * @author nvg
 */
@WebServlet(name = "ChangePasswordServlet", urlPatterns = {"/api/changepassword"})
public class ChangePasswordServlet extends HttpServlet {

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
            out.println("<title>Servlet ChangePasswordServlet</title>");
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ChangePasswordServlet at " + request.getContextPath() + "</h1>");
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
        processRequest(request, response);
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
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        JSONObject json = new JSONObject();

        try {
            // Get user ID from session
            HttpSession session = request.getSession(false);
            Integer userId = SessionUtil.getCurrentUserId(session);
            if (userId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                json.put("success", false);
                json.put("message", "Unauthorized: User not logged in");
                response.getWriter().write(json.toString());
                return;
            }

            // Read JSON body
            StringBuilder sb = new StringBuilder();
            BufferedReader reader = request.getReader();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            JSONObject body = new JSONObject(sb.toString());

            String oldPassword = body.optString("oldPassword", "").trim();
            String newPassword = body.optString("newPassword", "").trim();
            
            if (oldPassword.isEmpty()) {
                json.put("success", false);
                json.put("message", "Old password is required");
                response.getWriter().write(json.toString());
                return;
            }
            
            if (newPassword.isEmpty()) {
                json.put("success", false);
                json.put("message", "New password is required");
                response.getWriter().write(json.toString());
                return;
            }

            // Get current user to check old password
            UserDAO userDao = new UserDAO();
            User currentUser = userDao.getOne(userId);
            
            if (currentUser == null) {
                json.put("success", false);
                json.put("message", "User not found");
                response.getWriter().write(json.toString());
                return;
            }
            
            // Check if old password matches current password
            if (!oldPassword.equals(currentUser.getPasswordHash())) {
                json.put("success", false);
                json.put("message", "Old password is incorrect");
                response.getWriter().write(json.toString());
                return;
            }

            // Update password hash
            boolean updated = userDao.updatePasswordHashByID(userId, newPassword);

            if (updated) {
                json.put("success", true);
                json.put("message", "Password updated successfully");
            } else {
                json.put("success", false);
                json.put("message", "Failed to update password");
            }
        } catch (Exception e) {
            e.printStackTrace();
            json.put("success", false);
            json.put("message", "Internal server error");
        }

        response.getWriter().write(json.toString());
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
