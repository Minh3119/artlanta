package controller;

import dal.UserSocialLinkDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import model.UserSocialLink;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;

@WebServlet("/api/social-links/*")
public class UserSocialLinkServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Get the user ID from the URL
        int userId = -1;
        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1) {
            String idStr = pathInfo.substring(1);
            try {
                userId = Integer.parseInt(idStr);
                if (userId <= 0) {
                    JsonUtil.writeJsonError(response, "Invalid user ID");
                    return;
                }
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonError(response, "Invalid user ID");
                return;
            }
        } else {
            JsonUtil.writeJsonError(response, "User ID missing");
            return;
        }

        UserSocialLinkDAO dao = new UserSocialLinkDAO();
        List<UserSocialLink> links = dao.getByUserId(userId);
        dao.closeConnection();

        // Create JSON response
        JSONArray jsonLinks = new JSONArray();
        for (UserSocialLink link : links) {
            JSONObject jsonLink = new JSONObject();
            jsonLink.put("id", link.getId());
            jsonLink.put("userId", link.getUserId());
            jsonLink.put("platform", link.getPlatform());
            jsonLink.put("url", link.getUrl());
            jsonLink.put("createdAt", link.getCreatedAt().toString());
            jsonLinks.put(jsonLink);
        }

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonLinks);

        JsonUtil.writeJsonResponse(response, jsonResponse);
    }
} 