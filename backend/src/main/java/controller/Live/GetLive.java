package controller.Live;

import dal.AuctionDAO;
import dal.LiveDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;
import model.Auction;
import model.Live;
import model.Media;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;

public class GetLive extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        LiveDAO ld = new LiveDAO();
        AuctionDAO ad= new AuctionDAO();
//        list.add(new Live(1, 29, "Luong", "AVT", "TItle", 100, null, "Live", "PUBLIC"));

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject json = new JSONObject(sb.toString());
        String ID_raw = json.optString("ID", "").trim();

        try {
            int ID = Integer.parseInt(ID_raw);
            Live live = ld.getOne(ID);
            List<Auction> list= ad.getByID(String.valueOf(ID));
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
            
            
            obj.put("ID", live.getID());
            obj.put("UserID", live.getUserID());
            obj.put("UserName", live.getUserName());
            obj.put("Avt", live.getAvatar());
            obj.put("Title", live.getTitle());
            obj.put("View", live.getView());
            obj.put("Visibility", live.getVisibility());
            obj.put("CreatedAt", live.getCreatedAt());
            obj.put("LiveStatus", live.getLiveStatus());
            obj.put("LiveID", live.getLiveID());

            jsonResponse.put("response", obj);
            JsonUtil.writeJsonResponse(response, jsonResponse);

        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Server error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
