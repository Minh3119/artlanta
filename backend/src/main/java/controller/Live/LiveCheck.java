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
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;
import validation.EnvConfig;

public class LiveCheck extends HttpServlet {

    public String getLiveID(String channelName, String api_key) {
        try {
            String url = "https://www.youtube.com/" + channelName; // Ví dụ: "@Natlife19"
            HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder html = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                html.append(line);
            }
            in.close();

            Pattern pattern = Pattern.compile("https://www\\.youtube\\.com/channel/(UC[\\w-]+)");
            Matcher matcher = pattern.matcher(html.toString());

            if (matcher.find()) {
                return matcher.group(1);
            } else {
                return null;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
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
        String channelName = json.optString("channelLink", "").trim();
        String Title = json.optString("Title", "").trim();
        String Visibility = json.optString("Visibility", "").trim();

        try {

            Integer userID = SessionUtil.getCurrentUserId(session);
//            Integer userID = 29;
            if (userID == null) {
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("error", "Login first");
                JsonUtil.writeJsonResponse(response, jsonResponse);
            }
            String liveID = getLiveID(channelName, api_key);
            if (liveID != null) {
                String api = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + liveID + "&eventType=live&type=video&key=" + api_key;
                URL url = new URL(api);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
//                conn.setRequestProperty("User-Agent", "Mozilla/5.0");
//                conn.setRequestProperty("Accept", "application/json");

                reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                StringBuilder videoData = new StringBuilder();
                while ((line = reader.readLine()) != null) {
                    videoData.append(line);
                }
                reader.close();
                conn.disconnect();

                JSONObject result = new JSONObject(videoData.toString());
                JSONArray items = result.getJSONArray("items");
                if (items.length() > 0) {
                    JSONObject idObj = items.getJSONObject(0).getJSONObject("id");
                    String videoID = idObj.getString("videoId");
                    LiveDAO ld = new LiveDAO();
                    int ID = ld.insertLive(userID, Title, videoID, Visibility);
                    System.out.println("ID:" + ID);
                    JSONObject jsonResponse = new JSONObject();
                    jsonResponse.put("response", ID);
                    JsonUtil.writeJsonResponse(response, jsonResponse);
                } else {
                    //error
                    JSONObject jsonResponse = new JSONObject();
                    jsonResponse.put("error", "Pls live before submit the form");
                    JsonUtil.writeJsonResponse(response, jsonResponse);
                }
            } else {
                JSONObject jsonResponse = new JSONObject();
                jsonResponse.put("error", "User error");
                JsonUtil.writeJsonResponse(response, jsonResponse);
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
