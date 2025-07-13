/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import dal.UserDAO;
import dal.FollowDAO;
import java.util.List;
import model.User;
import org.json.JSONArray;
import org.json.JSONObject;
import util.SessionUtil;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "SuggestFollowServlet", urlPatterns = {"/api/suggestFollow"})
public class SuggestFollowServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        UserDAO userDao = new UserDAO();
        FollowDAO followDao = new FollowDAO();
        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));

        List<Integer> suggestID = followDao.getSuggestedFollowUserIds(userId);

        if (suggestID == null || suggestID.isEmpty()) {
            suggestID = followDao.getTop5FollowedUserIDs();
        }

        List<User> userSuggestList = userDao.getUsersByIds(suggestID);

        JSONArray jsonArray = new JSONArray();

        for (User user : userSuggestList) {
            JSONObject obj = new JSONObject();
            obj.put("id", user.getID());
            obj.put("username", user.getUsername());
            obj.put("bio", user.getBio());
            obj.put("avatarUrl", user.getAvatarURL());
            jsonArray.put(obj);
        }

        response.getWriter().print(jsonArray.toString());
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCORSHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCORSHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
