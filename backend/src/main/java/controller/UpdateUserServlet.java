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
@WebServlet(name = "UpdateUserServlet", urlPatterns = {"/api/update-profile"})
public class UpdateUserServlet extends HttpServlet {

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

        try {
            User currentUser = userDAO.getOne(userId);
            if (currentUser == null) {
                json.addProperty("success", false);
                json.addProperty("message", "Không tìm thấy người dùng");
                response.getWriter().write(gson.toJson(json));
                return;
            }

//            String username = safeValue(reqBody, "username", currentUser.getUsername());
//            String fullName = safeValue(reqBody, "fullName", currentUser.getFullName());
//            String email = safeValue(reqBody, "email", currentUser.getEmail());
//            String gender = safeValue(reqBody, "gender", currentUser.getGender());
//            String address = safeValue(reqBody, "address", currentUser.getAddress());
//            String bio = safeValue(reqBody, "bio", currentUser.getBio());
//            String dateOfBirth = safeValue(reqBody, "dateOfBirth",
//                    currentUser.getDateOfBirth() != null
//                    ? currentUser.getDateOfBirth().toString() : null);
//
//            boolean updated = userDAO.updateUser(
//                    username, fullName, email, gender, address, bio, dateOfBirth
//            );
//
//            if (updated) {
//                json.addProperty("success", true);
//                json.addProperty("message", "Cập nhật thành công");
//            } else {
//                json.addProperty("success", false);
//                json.addProperty("message", "Không có thay đổi nào");
//            }

        } catch (Exception e) {
            e.printStackTrace();
            json.addProperty("success", false);
            json.addProperty("message", "Lỗi hệ thống");
        }

        response.getWriter().write(gson.toJson(json));
    }

    // Trả về fallback nếu bị thiếu hoặc rỗng
    private String safeValue(JsonObject obj, String key, String fallback) {
        if (!obj.has(key)) {
            return fallback;
        }
        String value = obj.get(key).getAsString().trim();
        return value.isEmpty() ? fallback : value;
    }
}
