/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */

package controller;

import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.json.JSONObject;

/**
 *
 * @author Asus
 */
public class ModeratorControl extends HttpServlet {
   
    /** 
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
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
            out.println("<title>Servlet ModeratorControl</title>");  
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ModeratorControl at " + request.getContextPath () + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    } 

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /** 
     * Handles the HTTP <code>GET</code> method.
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
        PrintWriter out = response.getWriter();
        
        try {
            int userId = Integer.parseInt(request.getParameter("userId"));
            
            JSONObject result = new JSONObject();
            result.put("userId", userId);
            UserDAO udao = new UserDAO();
            // Lấy tất cả 8 chỉ số phân tích từ UserDAO có sẵn
            JSONObject metrics = new JSONObject();
            
            // 1. Tỷ lệ tương tác (engagement rate)
            metrics.put("engagementRate", udao.getUserEngagementRate(userId));
            
            // 2. Tỷ lệ bài viết bị báo cáo  
            metrics.put("flaggedPostRate", udao.getUserFlaggedPostRate(userId));
            
            // 3. Tỷ lệ hoàn thành commission (cho artist)
            metrics.put("commissionSuccessRate", udao.getArtistCommissionSuccessRate(userId));
            
            // 5. Tỷ lệ follower/following
            metrics.put("followerRatio", udao.getUserFollowerRatio(userId));
            
            // 6. Tỷ lệ comment spam
            metrics.put("spamCommentRate", udao.getUserSpamCommentRate(userId));
            
            // 7. Mức độ tương tác livestream
            metrics.put("livestreamEngagement", udao.getUserLiveStreamEngagement(userId));
            
            // 8. Tỷ lệ giao dịch thành công
            metrics.put("transactionSuccessRate", udao.getUserTransactionSuccessRate(userId));
            
            result.put("metrics", metrics);
            result.put("description", "Tất cả chỉ số phân tích người dùng cho moderator");
            result.put("timestamp", System.currentTimeMillis());
            
            out.print(result.toString());
            
        } catch (NumberFormatException e) {
            JSONObject error = new JSONObject();
            error.put("error", "Invalid userId parameter");
            error.put("message", "userId phải là số nguyên");
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print(error.toString());
            
        } catch (Exception e) {
            JSONObject error = new JSONObject();
            error.put("error", "Server error");
            error.put("message", e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(error.toString());
        }
    }
    /** 
     * Handles the HTTP <code>POST</code> method.
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        processRequest(request, response);
    }

    /** 
     * Returns a short description of the servlet.
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
