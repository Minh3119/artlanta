

package controller.Music;

import dal.MusicDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;


public class DeletePlayTime extends HttpServlet {
   

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        
    } 


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        
    } 


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        MusicDAO md = new MusicDAO();
        HttpSession session = request.getSession();
        try {
            Integer userID = SessionUtil.getCurrentUserId(session);

            md.deletePlayTime(userID);
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "Error update play time");
        }
    }


    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
