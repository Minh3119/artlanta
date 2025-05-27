package controller;

import dal.PortfolioDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import model.Portfolio;
import org.json.JSONObject;
import util.JsonUtil;

@WebServlet("/api/portfolio/*")
public class PortfolioServlet extends HttpServlet {

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
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

        PortfolioDAO dao = new PortfolioDAO();
        Portfolio portfolio = dao.getByArtistId(artistId);
        if (portfolio == null) {
            JsonUtil.writeJsonError(response, "Portfolio not found");
            return;
        }

        // Create JSON response
        JSONObject jsonPortfolio = new JSONObject();
        jsonPortfolio.put("artistId", portfolio.getArtistId());
        jsonPortfolio.put("title", portfolio.getTitle());
        jsonPortfolio.put("description", portfolio.getDescription());
        jsonPortfolio.put("coverUrl", portfolio.getCoverUrl());
        jsonPortfolio.put("achievements", portfolio.getAchievements());
        jsonPortfolio.put("createdAt", portfolio.getCreatedAt().toString());

        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("response", jsonPortfolio);

        JsonUtil.writeJsonResponse(response, jsonResponse);
    }
} 