
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
import model.Music;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;


public class DeletePlaylist extends HttpServlet {
   
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
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject json = new JSONObject(sb.toString());
        String ID_raw = json.optString("ID", "").trim();
        try {
            int ID= Integer.parseInt(ID_raw);

            md.deletePlaylist(ID);
            //testAPI
//            JsonUtil.writeJsonError(response, playlistLink);
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "Error update music");
        }
    }


    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
