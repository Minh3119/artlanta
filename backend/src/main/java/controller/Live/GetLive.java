package controller.Live;

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
import model.Live;
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
            JSONObject jsonResponse = new JSONObject();
            JSONObject obj = new JSONObject();
            obj.append("ID", live.getID());
            obj.append("UserID", live.getUserID());
            obj.append("UserName", live.getUserName());
            obj.append("Avt", live.getAvatar());
            obj.append("Title", live.getTitle());
            obj.append("View", live.getView());
            obj.append("Visibility", live.getVisibility());
            obj.append("CreatedAt", live.getCreatedAt());
            obj.append("LiveStatus", live.getLiveStatus());
            obj.append("LiveID", live.getLiveID());

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
