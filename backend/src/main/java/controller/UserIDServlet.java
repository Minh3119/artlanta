package controller;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import static org.apache.http.client.methods.RequestBuilder.post;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

public class UserIDServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        Integer userID = (Integer) SessionUtil.getCurrentUserId(session);
        JSONObject jsonPost = new JSONObject();
        jsonPost.put("userID", userID);
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonPost);
        
        
        JsonUtil.writeJsonResponse(response, jsonResponse);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
