/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dal.ArtistInfoDAO;
import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import model.ArtistInfo;
import model.User;
import util.SessionUtil;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "EditArtistInfoServlet", urlPatterns = {"/api/update-artist"})
public class EditArtistInfoServlet extends HttpServlet {

    private final Gson gson = new Gson();
    private final ArtistInfoDAO userInfoDAO = new ArtistInfoDAO();

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

        try {
            BufferedReader reader = request.getReader();
            JsonObject reqBody = gson.fromJson(reader, JsonObject.class);

            ArtistInfo currentUser = userInfoDAO.getOne(userId);
            if (currentUser == null) {
                json.addProperty("success", false);
                json.addProperty("message", "Không tìm thấy người dùng");
                response.getWriter().write(gson.toJson(json));
                return;
            }

            String phoneNumber = safeValue(reqBody, "phoneNumber", currentUser.getPhoneNumber());
            String specialty = safeValue(reqBody, "specialty", currentUser.getSpecialty());
            int experienceYears = safeValue(reqBody, "experienceYears", currentUser.getExperienceYears());

            if (userInfoDAO.isPhoneNumberTakenByOthers(phoneNumber, userId)) {
                json.addProperty("success", false);
                json.addProperty("message", "Số điện thoại đã tồn tại");
                response.getWriter().write(gson.toJson(json));
                return;
            }

            userInfoDAO.updateArtistInfoBasicFields(userId, phoneNumber, specialty, experienceYears);

            json.addProperty("success", true);
            json.addProperty("message", "Cập nhật thành công");

        } catch (Exception e) {
            e.printStackTrace();
            json.addProperty("success", false);
            json.addProperty("message", "Lỗi hệ thống");
        }

        response.getWriter().write(gson.toJson(json));
    }

    private String safeValue(JsonObject obj, String key, String fallback) {
        if (!obj.has(key)) return fallback;
        String value = obj.get(key).getAsString().trim();
        return value.isEmpty() ? fallback : value;
    }

    private boolean safeValue(JsonObject obj, String key, boolean fallback) {
        if (!obj.has(key)) return fallback;
        String value = obj.get(key).getAsString().trim();
        if (value.equals("1") || value.equalsIgnoreCase("true")) return true;
        if (value.equals("0") || value.equalsIgnoreCase("false")) return false;
        return fallback;
    }

    private int safeValue(JsonObject obj, String key, int fallback) {
        if (!obj.has(key)) return fallback;
        try {
            return Integer.parseInt(obj.get(key).getAsString().trim());
        } catch (NumberFormatException e) {
            return fallback;
        }
    }
}
