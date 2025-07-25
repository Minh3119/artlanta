/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */

package controller.commission;

import dal.CommissionDAO;
import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import model.CommissionRequest;
import model.User;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import static util.SessionUtil.getCurrentUserId;

/**
 *
 * @author Asus
 */
public class ClientCommission extends HttpServlet {
   
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
            out.println("<title>Servlet ClientCommission</title>");  
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet ClientCommission at " + request.getContextPath () + "</h1>");
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
    public static String getTimeAgo(LocalDateTime dateTime) {
    LocalDateTime now = LocalDateTime.now();
    Duration duration = Duration.between(dateTime, now);

    long days = duration.toDays();
    long hours = duration.toHours();
    long minutes = duration.toMinutes();

    if (days > 0) return days + " ngày trước";
    if (hours > 0) return hours + " giờ trước";
    if (minutes > 0) return minutes + " phút trước";
    return "vừa xong";
}
    @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");

    HttpSession session = request.getSession(false);
    Integer ClientID = getCurrentUserId(session);

    if ( ClientID == null) {
        JSONObject errorJson = new JSONObject();
        errorJson.put("error", "Chưa đăng nhập");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        JsonUtil.writeJsonResponse(response, errorJson);
        return;
    }

    CommissionDAO cdao = new CommissionDAO();
    UserDAO udao = new UserDAO();
    JSONArray jsonRequests = new JSONArray();
	JSONObject jsonResponse = new JSONObject();
    try {
        List<CommissionRequest> requests = cdao.getClientRequestsByClientID( ClientID);

        for (CommissionRequest r : requests) {
            JSONObject json = new JSONObject();
            User artist = udao.getOne(r.getArtistID());

            json.put("requestID", r.getID());
            json.put("artistID", r.getArtistID());
            json.put("reply",r.getArtistReply());
            json.put("description", r.getShortDescription());
            json.put("price", r.getProposedPrice());
            json.put("status", r.getStatus());
	   json.put("deadline", r.getProposedDeadline().toLocalDate().toString());
            json.put("createdAt", getTimeAgo(r.getRequestAt()));
	   json.put("refeURL", r.getReferenceURL());
	   json.put("clientname", udao.getUNByUserID(r.getClientID()));
	   json.put("clientid", r.getClientID());

            jsonRequests.put(json);
        }

        
        jsonResponse.put("response", jsonRequests);
	jsonResponse.put("artistUsername", udao.getUNByUserID( ClientID));
         jsonResponse.put("artistAvatar", udao.getAvatarByUserID( ClientID));
        JsonUtil.writeJsonResponse(response, jsonResponse);
    } finally {
        cdao.closeConnection();
        udao.closeConnection();
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
