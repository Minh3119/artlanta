package controller;

import dal.MediaDAO;
import dal.PortfolioDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import model.Portfolio;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;

@WebServlet("/api/portfolio/*")
public class PortfolioServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Get the artist ID from the URL
        int artistId = -1;
        String pathInfo = request.getPathInfo();
        if (pathInfo != null && pathInfo.length() > 1) {
            String idStr = pathInfo.substring(1);
            try {
                artistId = Integer.parseInt(idStr);
                if (artistId <= 0) {
                    JsonUtil.writeJsonError(response, "Invalid artist ID");
                    return;
                }
            } catch (NumberFormatException e) {
                JsonUtil.writeJsonError(response, "Invalid artist ID");
                return;
            }
        } else {
            JsonUtil.writeJsonError(response, "Artist ID missing");
            return;
        }

        PortfolioDAO portfolioDao = new PortfolioDAO();
        MediaDAO mediaDao = new MediaDAO();
        
        Portfolio portfolio = portfolioDao.getByArtistId(artistId);
        List<String> mediaUrls = mediaDao.getPortfolioMediaURLs(artistId);
        
        portfolioDao.closeConnection();
        mediaDao.closeConnection();
        
        if (portfolio == null) {
            JsonUtil.writeJsonError(response, "Portfolio not found");
            return;
        }

        // Create JSON response
        JSONObject jsonPortfolio = new JSONObject();
        jsonPortfolio.put("artistId", portfolio.getArtistID());
        jsonPortfolio.put("title", portfolio.getTitle());
        jsonPortfolio.put("description", portfolio.getDescription());
        jsonPortfolio.put("coverUrl", portfolio.getCoverURL());
        jsonPortfolio.put("achievements", portfolio.getAchievements());
        jsonPortfolio.put("createdAt", portfolio.getCreatedAt().toString());
        
        // Add media URLs array
        JSONArray mediaUrlsArray = new JSONArray();
        for (String url : mediaUrls) {
            mediaUrlsArray.put(url);
        }
        jsonPortfolio.put("mediaUrls", mediaUrlsArray);

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonPortfolio);

        JsonUtil.writeJsonResponse(response, jsonResponse);
    }
} 