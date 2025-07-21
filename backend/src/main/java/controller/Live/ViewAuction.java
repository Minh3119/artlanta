

package controller.Live;

import dal.AuctionDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.util.List;
import model.Auction;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;

public class ViewAuction extends HttpServlet {
   

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
       
    } 

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        AuctionDAO ad= new AuctionDAO();
        
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject json = new JSONObject(sb.toString());
        String ID_raw = json.optString("ID", "").trim();
        
        try{
            List<Auction> list= ad.getByID(ID_raw);
            JSONObject jsonResponse = new JSONObject();
            JSONObject obj = new JSONObject();
            
            JSONArray imageArr = new JSONArray();
            for (Auction auc : list) {
                JSONObject item = new JSONObject();
                item.put("AucID", auc.getID());
                item.put("BidUserID", auc.getUserID());
                item.put("mediaURL", auc.getImageUrl());
                item.put("startPrice", auc.getStartPrice());
                item.put("IsBid", auc.getIsBid());
                imageArr.put(item);
            }
            obj.put("imageUrl", imageArr);
            
            


            jsonResponse.put("response", obj);
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
