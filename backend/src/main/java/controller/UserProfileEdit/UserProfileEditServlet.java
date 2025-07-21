package controller.UserProfileEdit;

import dal.CommissionDAO;
import dal.SocialDAO;
import dal.UserDAO;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.time.format.DateTimeFormatter;
import java.util.List;
import model.SocialLink;
import model.User;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

public class UserProfileEditServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        UserDAO ud = new UserDAO();
        SocialDAO sd = new SocialDAO();
        String rawUserID = request.getParameter("id");
        HttpSession session= request.getSession();
        Integer userID= SessionUtil.getCurrentUserId(session);
        User user = ud.getOne(userID);
        List<SocialLink> social = sd.getByUserId(userID);
        int key=0;
        try {

            JSONObject jsonUser = new JSONObject();
            jsonUser.put("id", user.getID());
            jsonUser.put("username", user.getUsername());
            jsonUser.put("fullname", user.getFullName());
            jsonUser.put("bio", user.getBio());
            jsonUser.put("avatarUrl", user.getAvatarURL());
            jsonUser.put("location", user.getLocation());
            jsonUser.put("email", user.getEmail());
            jsonUser.put("gender", user.getGender() ? "Male" : "Female");
	  jsonUser.put("role", user.getRole());
	
            if (user.getDOB()!=null) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String formattedDateTime = user.getDOB().format(formatter);
                jsonUser.put("dob", formattedDateTime);
            }

            JSONArray socialList = new JSONArray();
            for (SocialLink s : social) {
                JSONObject socialObj = new JSONObject();
                socialObj.put("key", key++);
                socialObj.put("platform", s.getPlatform());
                socialObj.put("url", s.getUrl());
                socialList.put(socialObj);
            }
            jsonUser.put("social", socialList);

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("response", jsonUser);
            response.getWriter().write(jsonResponse.toString());
            response.getWriter().flush();
	ud.closeConnection();
	sd.closeConnection();
//            JsonUtil.writeJsonResponse(response, jsonResponse);
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Internal server error\"}");
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
// processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

// public static void main(String[] args)
// {
// UserDAO ud = new UserDAO();
// System.out.println("hello"+ud.getOneToEdit(10));
// }
}
