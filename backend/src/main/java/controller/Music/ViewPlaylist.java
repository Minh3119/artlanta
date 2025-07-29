package controller.Music;

import dal.MusicDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import model.Music;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

public class ViewPlaylist extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession();
        MusicDAO md = new MusicDAO();
        List<Music> list = new ArrayList<>();
        try {
            Integer userID = SessionUtil.getCurrentUserId(session);
//            Integer userID=29;
            if (userID != null) {
                list = md.getPlaylistByUserID(userID);
            }

            JSONObject jsonMusic = new JSONObject();
            JSONArray mediaArr = new JSONArray();
            for (Music music : list) {
                JSONObject musicObj = new JSONObject();
                musicObj.put("ID", music.getID());
                musicObj.put("playlistName", music.getPlaylist());
                musicObj.put("playlistLink", music.getMediaURL());
                mediaArr.put(musicObj);
            }
            jsonMusic.put("response", mediaArr);
            JsonUtil.writeJsonResponse(response, jsonMusic);

        } catch (Exception e) {
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
    }

}
