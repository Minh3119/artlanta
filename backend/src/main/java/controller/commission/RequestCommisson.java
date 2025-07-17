/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */

package controller.commission;

import dal.CommissionDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import model.CommissionRequest;
import org.json.JSONObject;
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

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        processRequest(request, response);
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

        BigDecimal proposedPrice = null;
        if (proposedPriceStr != null && !proposedPriceStr.trim().isEmpty()) {
            try {
                proposedPrice = new BigDecimal(proposedPriceStr);
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

       
        dao.insertCommissionRequest(req);
	json.put("isOtherCom", dao.hasPendingRequest(userID, artistID));
		

		 json.put("success", true);
        json.put("message", "Đã gửi yêu cầu commission");
	
       
        response.getWriter().write(json.toString());
        System.out.println("Success: Commission request inserted");

    } catch (Exception e) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        json.put("error", "Lỗi: " + e.getMessage());
        response.getWriter().write(json.toString());
        System.out.println("Exception: " + e.getMessage());
        e.printStackTrace();
		
    } finally {
    dao.closeConnection(); // luôn đóng kết nối
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
