//package controller;
//
//import java.io.IOException;
//import java.io.PrintWriter;
//
//import org.json.JSONObject;
//
//import jakarta.servlet.ServletException;
//import jakarta.servlet.annotation.WebServlet;
//import jakarta.servlet.http.HttpServlet;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import model.User;
//import util.JsonUtil;
//import dal.UserDAO;
//
//@WebServlet("/api/user/*")
//public class UserServlet extends HttpServlet {
//
//    @Override
//    protected void doGet(HttpServletRequest request, HttpServletResponse response)
//            throws ServletException, IOException {
//        response.setContentType("application/json");
//        response.setCharacterEncoding("UTF-8");
//
//        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
//        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
//
//        // Get the last part of the URL
//        int userId = -1;
//        String pathInfo = request.getPathInfo(); // example: "/2"
//        if (pathInfo != null && pathInfo.length() > 1) {
//            String idStr = pathInfo.substring(1); // remove leading "/"
//            try {
//                userId = Integer.parseInt(idStr);
//                if (userId <= 0) {
//                    JsonUtil.writeJsonError(response, "Invalid user ID");
//                    return;
//                }
//            } catch (NumberFormatException e) {
//                JsonUtil.writeJsonError(response, "Invalid user ID");
//                return;
//            }
//        } else {
//            JsonUtil.writeJsonError(response, "User ID missing");
//            return;
//        }
//
//        UserDAO dao = new UserDAO();
//        User user = dao.getOne(userId);
//        if (user == null) {
//            JsonUtil.writeJsonError(response, "User not found");
//            return;
//        }
//
//        // Respond
//        JSONObject jsonUser = new JSONObject();
//        jsonUser.put("id", user.getId());
//        jsonUser.put("username", user.getUsername());
//        jsonUser.put("displayName", user.getDisplayName());
//        jsonUser.put("bio", user.getBio());
//
//        JSONObject jsonResponse = new JSONObject();
//        jsonResponse.put("response", jsonUser);
//
//        JsonUtil.writeJsonResponse(response, jsonResponse);
//
//    }
//
//}
