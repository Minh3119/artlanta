/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import org.json.JSONObject;
import util.MailSender;
import util.OTPGenerator;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "ForgetPassServlet", urlPatterns = {"/api/forgetpass"})
public class ForgetPassServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        BufferedReader reader = request.getReader();
        StringBuilder jsonBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }
        
        JSONObject body = new JSONObject(jsonBuilder.toString());
        JSONObject res = new JSONObject();
        String step = body.optString("step");
        
        switch (step) {
            case "1":
                HandleOTP(body, res);
                break;
            case "3":
                HandePassword(body, res);
                break;
            default:
                res.put("success", false);
                res.put("message", "Step không hợp lệ");
        }
        
        response.getWriter().write(res.toString());
    }
    
    private void HandleOTP(JSONObject body, JSONObject res) {
        String email = body.optString("email", "").trim();
        UserDAO userDao = new UserDAO();
        
        if (!userDao.checkUserExistsByEmail(email)) {
            res.put("success", false);
            res.put("message", "Email không tồn tại");
            return;
        }
        
        String otp = OTPGenerator.generateOTP(6);
        boolean sent = MailSender.sendEmail(email, otp, getServletContext());
        
        if (sent) {
            res.put("success", true);
            res.put("message", "OTP đã được gửi tới email của bạn");
            res.put("otp", otp);
        } else {
            res.put("success", false);
            res.put("message", "Gửi email thất bại");
        }
    }
    
    private void HandePassword(JSONObject body, JSONObject res) {
        String email = body.optString("email", "").trim();
        String newPassword = body.optString("newPassword");
        UserDAO userDao = new UserDAO();
        
        boolean updated = userDao.updatePasswordHashByEmail(email, newPassword);
        
        if (updated) {
            res.put("success", true);
            res.put("message", "Đổi mật khẩu thành công");
        } else {
            res.put("success", false);
            res.put("message", "Không thể đổi mật khẩu, vui lòng thử lại");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
