/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import model.User;
import util.SessionUtil;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "ChangePassEditProfileServlet", urlPatterns = {"/api/change-password"})
public class ChangePassEditProfileServlet extends HttpServlet {

    private final Gson gson = new Gson();
    private final UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        JsonObject json = new JsonObject();

        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));
        if (userId == null) {
            json.addProperty("success", false);
            json.addProperty("message", "Phiên đăng nhập hết hạn");
            response.getWriter().write(gson.toJson(json));
            return;
        }

        BufferedReader reader = request.getReader();
        JsonObject reqBody = gson.fromJson(reader, JsonObject.class);
        String currentPassword = reqBody.get("currentPassword").getAsString();
        String newPassword = reqBody.get("newPassword").getAsString();

        try {
            User user = userDAO.getOne(userId);
            if (user == null) {
                json.addProperty("success", false);
                json.addProperty("message", "Không tìm thấy người dùng");
                response.getWriter().write(gson.toJson(json));
                return;
            }

            if (!userDAO.isPasswordMatch( userId, currentPassword)) {
                json.addProperty("success", false);
                json.addProperty("message", "Mật khẩu hiện tại không chính xác");
                response.getWriter().write(gson.toJson(json));
                return;
            }

            boolean updated = userDAO.updatePasswordHashByID(userId, newPassword);

            if (updated) {
                json.addProperty("success", true);
                json.addProperty("message", "Mật khẩu đã được cập nhật thành công");
            } else {
                json.addProperty("success", false);
                json.addProperty("message", "Cập nhật mật khẩu thất bại");
            }

        } catch (Exception e) {
            e.printStackTrace();
            json.addProperty("success", false);
            json.addProperty("message", "Lỗi server");
        }

        response.getWriter().write(gson.toJson(json));
    }
}
