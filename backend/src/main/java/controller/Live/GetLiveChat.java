

package controller.Live;

import dal.LiveDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import model.LiveChatMessage;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;


public class GetLiveChat extends HttpServlet {
   



    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        String id_raw= request.getParameter("livePost");
        List<LiveChatMessage> list= new ArrayList<>();
        try{
            LiveDAO ld= new LiveDAO();
            list=ld.getLiveChatMessage(id_raw);
            JSONObject jsonResponse = new JSONObject();
            JSONArray arr= new JSONArray();
            for(LiveChatMessage l: list){
                JSONObject o= new JSONObject();
                o.put("UserID", l.getUserID());
                o.put("Username", l.getUsername());
                o.put("Type", l.getType());
                o.put("Message", l.getMessage());
                arr.put(o);
            }
            
            jsonResponse.put("response", arr);
            JsonUtil.writeJsonResponse(response, jsonResponse);
        }
        catch(Exception e){
            e.printStackTrace();
        }
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
