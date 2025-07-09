package controller.Live;

import dal.LiveDAO;
import dal.MediaDAO;
import dal.PostDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;
import model.Live;
import model.Media;
import model.Post;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class LivePage extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        LiveDAO ld = new LiveDAO();
        List<Live> list = new ArrayList<>();
//        list.add(new Live(1, 29, "Luong", "AVT", "TItle", 100, null, "Live", "PUBLIC"));

        try {

            list = ld.getAll();
//            JSONArray liveArr = new JSONArray();
//            for (Live live : list) {
//                JSONObject obj = new JSONObject(live);
//                liveArr.put(obj);
//            }
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("response", list);
            JsonUtil.writeJsonResponse(response, jsonResponse);

        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Server error: " + e.getMessage());
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
