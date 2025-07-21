
package controller.Live;

import dal.LiveDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import org.json.JSONObject;
import util.JsonUtil;

/**
 *
 * @author ADMIN
 */
public class ViewViewer extends HttpServlet {


    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        
    } 


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        LiveDAO ld= new LiveDAO();
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject json = new JSONObject(sb.toString());
        String ID_raw = json.optString("ID", "").trim();
        
        try{
            int ID= Integer.parseInt(ID_raw);
            int view=ld.getView(ID);
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("View", view);
            JsonUtil.writeJsonResponse(response, jsonResponse);
            
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
