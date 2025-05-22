package controller;

import java.io.IOException;
import java.io.PrintWriter;

import org.json.JSONObject;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.User;
import dal.UserDAO;

@WebServlet("/api/user/*")
public class UserServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");

        // Get the last part of the URL
        int userId = -1;
        String errorMessage = null;
        String pathInfo = request.getPathInfo(); // e.g., "/2"
        if (pathInfo != null && pathInfo.length() > 1) {
            String idStr = pathInfo.substring(1); // remove leading "/"
            try {
                userId = Integer.parseInt(idStr);
                if (userId <= 0) {
                    errorMessage = "Invalid user ID";
                }
            } catch (NumberFormatException e) {
                errorMessage = "Invalid user ID";
                //response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid user ID");  //TODO: replace this with json
                //return;
            }
        } else {
            errorMessage = "User ID missing";
            //response.sendError(HttpServletResponse.SC_BAD_REQUEST, "User ID missing");  //TODO: replace this with json
            //return;
        }

        if (errorMessage != null) {
            try (PrintWriter out = response.getWriter()) {
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("error", errorMessage);
                out.write(jsonResponse.toString());
                out.flush();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }

        UserDAO dao = new UserDAO();
        User user = dao.getOne(userId);
        if (user == null) {
            errorMessage = "User not found";
            if (errorMessage != null) {
                try (PrintWriter out = response.getWriter()) {
                    JSONObject jsonResponse = new JSONObject();
                    jsonResponse.put("error", errorMessage);
                    out.write(jsonResponse.toString());
                    out.flush();
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return;
            }
        }

        // Respond
        // Parse JSON
        JSONObject jsonUser = new JSONObject();
        jsonUser.put("id", user.getId());
        jsonUser.put("username", user.getUsername());
        jsonUser.put("displayName", user.getDisplayName());
        jsonUser.put("bio", user.getBio());

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonUser);

        try (PrintWriter out = response.getWriter()) {
			out.write(jsonResponse.toString());
			out.flush();
		} catch (Exception e) {
		  //TODO: handle exception
		}

    }

}
