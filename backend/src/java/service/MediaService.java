package service;

import java.time.LocalDateTime;
import java.util.List;
import model.Media;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MediaService {
	
    public static JSONArray convertMediaListToJsonArray(List<Media> mediaList) throws JSONException {
        if (mediaList == null) {
            return new JSONArray();
        }

        JSONArray jsonUsers = new JSONArray();
        for (Media media : mediaList) {
            try {
                JSONObject jsonMedia = new JSONObject();
                jsonMedia.put("id", media.getID());
                jsonMedia.put("url", media.getURL());
                jsonMedia.put("description", media.getDescription());
                jsonUsers.put(jsonMedia);
            } catch (Exception e) {
                // Log the error for this user but continue processing others
                e.printStackTrace();
            }
        }
        return jsonUsers;
    }
	
	private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.toString() : null;
    }
}
