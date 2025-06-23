package service;

import dal.PortfolioDAO;
import dal.MediaDAO;
import model.Portfolio;
import model.Media;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.List;
import java.time.LocalDateTime;

public class PortfolioService {
    private final PortfolioDAO portfolioDAO;
    private final MediaDAO mediaDAO;

    public PortfolioService() {
        this.portfolioDAO = new PortfolioDAO();
        this.mediaDAO = new MediaDAO();
    }

    public JSONObject getPortfolioById(int artistId) throws JSONException {
        Portfolio portfolio = portfolioDAO.getByArtistId(artistId);
        if (portfolio == null) {
            return null;
        }

        List<Media> mediaList = mediaDAO.getPortfolioMedia(artistId);
        
        // Create JSON response
        JSONObject jsonPortfolio = new JSONObject();
        jsonPortfolio.put("artistId", portfolio.getArtistID());
        jsonPortfolio.put("title", portfolio.getTitle());
        jsonPortfolio.put("description", portfolio.getDescription());
        jsonPortfolio.put("coverUrl", portfolio.getCoverURL());
        jsonPortfolio.put("achievements", portfolio.getAchievements());
        jsonPortfolio.put("createdAt", portfolio.getCreatedAt().toString());
        
        // Add media array with full objects
        JSONArray mediaArray = new JSONArray();
        for (Media media : mediaList) {
            JSONObject mediaObj = new JSONObject();
            mediaObj.put("id", media.getID());
            mediaObj.put("url", media.getURL());
            mediaObj.put("description", media.getDescription());
            mediaArray.put(mediaObj);
        }
        jsonPortfolio.put("media", mediaArray);

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonPortfolio);
        return jsonResponse;
    }

    public boolean updatePortfolio(int artistId, JSONObject portfolioData) throws JSONException {
        Portfolio portfolio = new Portfolio(
            artistId,
            portfolioData.optString("title", ""),
            portfolioData.optString("description", ""),
            portfolioData.optString("coverUrl", ""),
            portfolioData.optString("achievements", ""),
            LocalDateTime.now()
        );
        
        return portfolioDAO.update(portfolio);
    }

    public int extractArtistId(String pathInfo) {
        if (pathInfo == null || pathInfo.length() <= 1) {
            return -1;
        }
        
        try {
            int artistId = Integer.parseInt(pathInfo.substring(1));
            return artistId > 0 ? artistId : -1;
        } catch (NumberFormatException e) {
            return -1;
        }
    }

    public void closeConnections() {
        try {
            portfolioDAO.closeConnection();
            mediaDAO.closeConnection();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
} 