package controller.Live;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONArray;
import org.json.JSONObject;
import util.SessionUtil;
import validation.EnvConfig;

public class LiveCheck extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        EnvConfig config = new EnvConfig();
        String api_key = config.getProperty("youtube_data_key");
        HttpSession session = request.getSession();

        StringBuilder sb = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        JSONObject json = new JSONObject(sb.toString());
        String channelLink = json.optString("channelLink", "").trim();
        String Title = json.optString("Title", "").trim();
        String Visibility = json.optString("Visibility", "").trim();
        try {
            Integer userID = SessionUtil.getCurrentUserId(session);
            String api = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + channelLink + "&eventType=live&type=video&key=" + api_key;
            URL url = new URL(api);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");

            reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder videoData = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                videoData.append(line);
            }
            reader.close();

            JSONObject result = new JSONObject(json.toString());
            JSONArray items = result.getJSONArray("items");
            if (items.length() > 0) {
                JSONObject idObj = items.getJSONObject(0).getJSONObject("id");
                String videoID = idObj.getString("videoId");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
