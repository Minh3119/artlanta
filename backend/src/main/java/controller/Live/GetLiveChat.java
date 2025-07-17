

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
            jsonResponse.put("response", list);
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
