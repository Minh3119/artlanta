/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.Notification;
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
                System.out.println("GET request received for userId: " + userIdParam);
                
                try (PrintWriter out = response.getWriter()) {
                    if (userIdParam == null) {
                        System.out.println("Error: userId is null");
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"error\": \"User ID is required\"}");
                        return;
                    }
                    int userId;
                    try {
                        userId = Integer.parseInt(userIdParam);
                    } catch (NumberFormatException e) {
                        System.out.println("Error: Invalid userId format: " + userIdParam);
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"error\": \"Invalid User ID format\"}");
                        return;
                    }

                    NotificationDAO notificationDAO = new NotificationDAO();
                    List<Notification> notifications = notificationDAO.getNotifications(userId);
                    System.out.println("Retrieved " + notifications.size() + " notifications for userId: " + userId);

                    StringBuilder jsonBuilder = new StringBuilder("[");
                    for (int i = 0; i < notifications.size(); i++) {
                        if (i > 0) {
                            jsonBuilder.append(",");
                        }
                        Notification n = notifications.get(i);
                        jsonBuilder.append("{")
                            .append("\"id\":").append(n.getID()).append(",")
                            .append("\"userId\":").append(n.getUserID()).append(",")
                            .append("\"type\":\"").append(escapeJson(n.getType())).append("\",")
                            .append("\"content\":\"").append(escapeJson(n.getContent())).append("\",")
                            .append("\"postId\":").append(n.getPostID() != null ? n.getPostID() : "null").append(",")
                            .append("\"isRead\":").append(n.isRead()).append(",")
                            .append("\"createdAt\":\"").append(n.getCreatedAt().toString()).append("\"")
                            .append("}");
                    }
                    jsonBuilder.append("]");
                    
                    String json = jsonBuilder.toString();
                    System.out.println("Sending JSON response: " + json);
                    out.write(json);
                } catch (Exception e) {
                    System.out.println("Error in doGet: " + e.getMessage());
                    e.printStackTrace();
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().print("{\"error\": \"Internal server error: " + e.getMessage() + "\"}");
                }
    }

    private String escapeJson(String input) {
        if (input == null) {
            return "";
        }
        return input.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\b", "\\b")
                   .replace("\f", "\\f")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
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

                System.out.println("POST request received with parameters:");
                System.out.println("userId: " + userIdParam);
                System.out.println("type: " + type);
                System.out.println("content: " + content);
                System.out.println("postId: " + postIdParam);
                System.out.println("action: " + action);

                try (PrintWriter out = response.getWriter()) {
                    NotificationDAO notificationDAO = new NotificationDAO();

                    if (userIdParam == null || type == null || content == null) {
                        System.out.println("Error: Missing required fields");
                        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                        out.print("{\"error\": \"Missing required fields\"}");
                        return;
                    }

                    int userId;
                    try {
                        userId = Integer.parseInt(userIdParam);
                    } catch (NumberFormatException e) {
                        System.out.println("Error: Invalid userId format: " + userIdParam);
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
                            System.out.println("Error: Invalid postId format: " + postIdParam);
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            out.print("{\"error\": \"Invalid Post ID format\"}");
                            return;
                        }
                        success = notificationDAO.saveNotification(userId, postId, type, content);
                    } else {
                        success = notificationDAO.saveNotification(userId, type, content);
                    }

                    if (success) {
                        System.out.println("Notification saved successfully");
                        response.setStatus(HttpServletResponse.SC_CREATED);
                        out.print("{\"message\": \"Notification saved successfully\"}");
                    } else {
                        System.out.println("Error: Failed to save notification");
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                        out.print("{\"error\": \"Failed to save notification\"}");
                    }

                    if("markAsRead".equals(action)) {
                        String idParam = request.getParameter("ID");
                        String isReadParam = request.getParameter("isRead");

                        if (idParam == null || isReadParam == null) {
                            System.out.println("Error: Missing ID or isRead parameter");
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
                            System.out.println("Error: Invalid ID or isRead format");
                            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                            out.print("{\"error\": \"Invalid ID or isRead format\"}");
                            return;
                        }

                        boolean marked = notificationDAO.markAsRead(id, isRead);
                        if (marked) {
                            System.out.println("Notification marked as read successfully");
                            response.setStatus(HttpServletResponse.SC_OK);
                            out.print("{\"message\": \"Notification marked as read\"}");
                        } else {
                            System.out.println("Error: Failed to mark notification as read");
                            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                            out.print("{\"error\": \"Failed to mark notification as read\"}");
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Error in doPost: " + e.getMessage());
                    e.printStackTrace();
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().print("{\"error\": \"Internal server error: " + e.getMessage() + "\"}");
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
