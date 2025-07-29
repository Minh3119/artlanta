/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */

package controller.commission;

import dal.CommissionDAO;
import dal.NotificationDAO;
import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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
public class RequestCommisson extends HttpServlet {
   
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head>");
            out.println("<title>Servlet RequestCommisson</title>");  
            out.println("</head>");
            out.println("<body>");
            out.println("<h1>Servlet RequestCommisson at " + request.getContextPath () + "</h1>");
            out.println("</body>");
            out.println("</html>");
        }
    } 
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
    Integer ArtistID = getCurrentUserId(session);

    if (ArtistID == null) {
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
        List<CommissionRequest> requests = cdao.getPendingRequestsByArtistID(ArtistID);

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
	jsonResponse.put("artistUsername", udao.getUNByUserID(ArtistID));
         jsonResponse.put("artistAvatar", udao.getAvatarByUserID(ArtistID));
        JsonUtil.writeJsonResponse(response, jsonResponse);
    } finally {
        cdao.closeConnection();
        udao.closeConnection();
    }
}


	
@Override
protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
	 CommissionDAO dao = new CommissionDAO();
    JSONObject json = new JSONObject(); // khai báo đối tượng JSON

    HttpSession session = request.getSession(false);
    Integer userID = getCurrentUserId(session); // chính là clientID
	
    if (userID == null) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        json.put("error", "Không đăng nhập");
        response.getWriter().write(json.toString());
        System.out.println("Error: User not logged in");
        return;
    }

    try {
        String artistIDStr = request.getParameter("artistID");
        String shortDescription = request.getParameter("shortDescription");
        String referenceURL = " ";
        String proposedPriceStr = request.getParameter("proposedPrice");
        String proposedDeadlineStr = request.getParameter("proposedDeadline");

        if (artistIDStr == null || shortDescription == null || shortDescription.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            json.put("error", "Thiếu dữ liệu bắt buộc");
            response.getWriter().write(json.toString());
            System.out.println("Error: Missing artistID or shortDescription");
            return;
        }
		
	

        int artistID;
        try {
            artistID = Integer.parseInt(artistIDStr);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            json.put("error", "artistID không hợp lệ");
            response.getWriter().write(json.toString());
            System.out.println("Error: Invalid artistID format");
            return;
        }


        Double proposedPrice=0.0;
        if (proposedPriceStr != null && !proposedPriceStr.trim().isEmpty()) {
            try {
                proposedPrice = Double.parseDouble(proposedPriceStr);
            } catch (NumberFormatException e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                json.put("error", "Giá không hợp lệ");
                response.getWriter().write(json.toString());
                System.out.println("Error: Invalid price");
                return;
            }
        }

        LocalDateTime proposedDeadline = null;
        if (proposedDeadlineStr != null && !proposedDeadlineStr.trim().isEmpty()) {
            try {
	proposedDeadline = LocalDate.parse(proposedDeadlineStr).atStartOfDay();

            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                json.put("error", "Định dạng thời gian sai");
                response.getWriter().write(json.toString());
                System.out.println("Error: Invalid deadline format");
                return;
            }
        }

        CommissionRequest req = new CommissionRequest();
        req.setClientID(userID);
        req.setArtistID(artistID);
        req.setShortDescription(shortDescription);
        req.setReferenceURL(referenceURL);
        req.setProposedPrice(proposedPrice);
        req.setProposedDeadline(proposedDeadline);
       UserDAO udao = new UserDAO();
       NotificationDAO ndao = new NotificationDAO();
	ndao.saveNotification(artistID, "Commission Request", udao.getUNByUserID(userID)+" has sent you a commission request.");
        dao.insertCommissionRequest(req);
	json.put("isOtherCom", dao.hasPendingRequest(userID, artistID));
		

	json.put("success", true);
        json.put("message", "Đã gửi yêu cầu commission");
	
       
        response.getWriter().write(json.toString());
        System.out.println("Success: Commission request inserted");
       udao.closeConnection();
	   ndao.closeConnection();
    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        json.put("error", "Lỗi: " + e.getMessage());
        response.getWriter().write(json.toString());
        System.out.println("Exception: " + e.getMessage());
        e.printStackTrace();
		
    } finally {
    dao.closeConnection(); 
}
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
