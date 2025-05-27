/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller.UserProfileEdit;

import com.google.gson.Gson;
import dal.UserDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.List;
import model.SocialLink;
import model.User;
//import com.google.gson.Gson;

/**
 *
 * @author ADMIN
 */
public class UserProfileEditServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
//        List<SocialLink> socialLinks = Arrays.asList(
//                new SocialLink("Facebook", "https://facebook.com/example"),
//                new SocialLink("LinkedIn", "https://linkedin.com/in/example")
//        );

//        User profile = new User();
//        profile.setLogo("https://example.com/logo.png");
//        profile.setFullname("Nguyen Van A");
//        profile.setGender("Male");
//        profile.setDob("1990-01-01");
//        profile.setEmail("nguyenvana@example.com");
//        profile.setSocial(socialLinks);
//        profile.setLocation("Hanoi, Vietnam");
//        profile.setDescription("A passionate software developer.");
        UserDAO ud = new UserDAO();
        String rawUserID = request.getParameter("id");
        int userID;
        
        try {
//            userID = Integer.parseInt(rawUserID);
            userID=10;
            Gson gson = new Gson();
            String json = gson.toJson(ud.getOneToEdit(userID));

            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(json);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
//        processRequest(request, response);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
    
//    public static void main(String[] args)
//    {
//        UserDAO ud = new UserDAO();
//        System.out.println("hello"+ud.getOneToEdit(10));
//    }

}

