/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Notification;
import com.google.gson.Gson;
import dal.NotificationDAO;

/**
 *
 * @author nvg
 */

@WebServlet(name = "Notification", urlPatterns = {"/api/notifications"})
public class NotificationServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */

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
                try (PrintWriter out = response.getWriter()) {
                    if (userIdParam == null) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"error\": \"User ID is required\"}");
                        return;
                    }
                    int userId;
                    try {
                        userId = Integer.parseInt(userIdParam);
                    } catch (NumberFormatException e) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"error\": \"Invalid User ID format\"}");
                        return;
                    }

                    NotificationDAO notificationDAO = new NotificationDAO();
                    List<Notification> notifications = notificationDAO.getNotifications(userId);

                    Gson gson = new Gson();
                    String json = gson.toJson(notifications);
                    out.write(json);
;                }
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
                response.setContentType("application/json;charset=UTF-8");
                String userIdParam = request.getParameter("userId");
                String type = request.getParameter("type");
                String content = request.getParameter("content");
                String postIdParam = request.getParameter("postId");

                String action = request.getParameter("action");

                try (PrintWriter out = response.getWriter()) {
                    
                    NotificationDAO notificationDAO = new NotificationDAO();

                    if ( userIdParam == null || type == null || content == null) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"error\": \"Missing required fields\"}");
                        return;
                    }

                    int userId;
                    try {
                        userId = Integer.parseInt(userIdParam);
                    } catch (NumberFormatException e) {
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"error\": \"Invalid User ID format\"}");
                        return;
                    }

                    boolean success;
                    if (postIdParam != null && !postIdParam.isEmpty()) {
                        int postId;
                        try {
                            postId = Integer.parseInt(postIdParam);
                        } catch (NumberFormatException e) {
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            out.print("{\"error\": \"Invalid Post ID format\"}");
                            return;
                        }
                        success = notificationDAO.saveNotification(userId, postId, type, content);
                    } else {
                        success = notificationDAO.saveNotification(userId, type, content);
                    }

                    if (success) {
                        response.setStatus(HttpServletResponse.SC_CREATED);
                        out.print("{\"message\": \"Notification saved successfully\"}");
                    } else {
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        out.print("{\"error\": \"Failed to save notification\"}");
                    }

                    if("markAsRead".equals(action)) {
                        String idParam = request.getParameter("ID");
                        String isReadParam = request.getParameter("isRead");

                        if (idParam == null || isReadParam == null) {
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            out.print("{\"error\": \"Missing ID or isRead parameter\"}");
                            return;
                        }

                        int id;
                        boolean isRead;

                        try {
                            id = Integer.parseInt(idParam);
                            isRead = Boolean.parseBoolean(isReadParam);
                        } catch (NumberFormatException e) {
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            out.print("{\"error\": \"Invalid ID or isRead format\"}");
                            return;
                        }

                        boolean marked = notificationDAO.markAsRead(id, isRead);
                        if (marked) {
                            response.setStatus(HttpServletResponse.SC_OK);
                            out.print("{\"message\": \"Notification marked as read\"}");
                        } else {
                            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                            out.print("{\"error\": \"Failed to mark notification as read\"}");
                        }
                    }
                }
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
