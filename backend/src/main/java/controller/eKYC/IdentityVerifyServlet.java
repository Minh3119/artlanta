/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.eKYC;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import org.json.JSONObject;
import util.FptOcrService;

/**
 *
 * @author anhkt
 */
@MultipartConfig
@WebServlet(name = "IdentityVerifyServlet", urlPatterns = {"/api/verify-identity"})
public class IdentityVerifyServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setContentType("application/json");
        JSONObject json = new JSONObject();

        int maxSizeFile = 5242880;

        Part imgNCheck = request.getPart("document");
        Part faceImage = request.getPart("face");
        Part documentTypePart = request.getPart("documentType");

        String documentType = getStringFromPart(documentTypePart);

        if (imgNCheck == null || faceImage == null) {
            response.setStatus(400);
            json.put("success", false);

            if (documentType.equals("passport")) {
                json.put("message", "Thiếu ảnh passport hoặc ảnh chân dung.");
            }

            if (documentType.equals("cccd")) {
                json.put("message", "Thiếu ảnh cccd hoặc ảnh chân dung.");
            }

            response.getWriter().write(json.toString());
            return;
        }

        if (imgNCheck.getSize() == 0 || faceImage.getSize() == 0) {
            response.setStatus(400);
            json.put("success", false);
            json.put("message", "File ảnh không được để trống.");
            response.getWriter().write(json.toString());
            return;
        }

        if (!isValidImageType(imgNCheck.getContentType()) || !isValidImageType(faceImage.getContentType())) {
            response.setStatus(400);
            json.put("success", false);
            json.put("message", "File phải là ảnh định dạng JPEG hoặc PNG.");
            response.getWriter().write(json.toString());
            return;
        }

        if (imgNCheck.getSize() > maxSizeFile || faceImage.getSize() > maxSizeFile) {
            response.setStatus(413);
            json.put("success", false);
            json.put("message", "Mỗi ảnh không được vượt quá 5MB.");
            response.getWriter().write(json.toString());
            return;
        }

        boolean isImgNCheck = FptOcrService.verifyDocument(imgNCheck, documentType);

        if (!isImgNCheck) {
            response.setStatus(422);
            json.put("success", false);
            String errorMessage = "passport".equals(documentType)
                    ? "Ảnh passport không hợp lệ hoặc không đọc được thông tin."
                    : "Ảnh CCCD không hợp lệ hoặc không đọc được số ID.";

            json.put("message", errorMessage);
            response.getWriter().write(json.toString());
            return;
        }

        boolean isFaceMatch = FptOcrService.verifyFaceMatch(imgNCheck, faceImage);

        if (!isFaceMatch) {
            response.setStatus(422);
            json.put("success", false);
            String errorMessage = "passport".equals(documentType)
                    ? "Khuôn mặt không khớp với ảnh trên passport."
                    : "Khuôn mặt không khớp với ảnh trên CCCD.";

            json.put("message", errorMessage);
            response.getWriter().write(json.toString());
            return;
        }

        json.put("success", true);
        json.put("message", "Xác thực eKYC thành công.");
        response.getWriter().write(json.toString());
    }

    private boolean isValidImageType(String contentType) {
        if (contentType == null) {
            return false;
        }

        String[] allowType = {
            "image/jpeg", "image/jpg", "image/png"
        };

        for (String allowedType : allowType) {
            if (contentType.equals(allowedType)) {
                return true;
            }
        }
        return false;
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    private String getStringFromPart(Part part) throws IOException {
        try (var inputStream = part.getInputStream()) {
            return new String(inputStream.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8).trim();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCORSHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
