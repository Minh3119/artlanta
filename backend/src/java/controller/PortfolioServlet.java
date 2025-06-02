package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.json.JSONObject;
import util.JsonUtil;
import service.PortfolioService;

@WebServlet("/api/portfolio/*")
public class PortfolioServlet extends HttpServlet {
    private final PortfolioService portfolioService;

    public PortfolioServlet() {
        this.portfolioService = new PortfolioService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Get the artist ID from the URL
            int artistId = extractArtistId(request.getPathInfo());
            if (artistId == -1) {
                JsonUtil.writeJsonError(response, "Invalid or missing artist ID");
                return;
            }

            // Get the portfolio by artist ID
            JSONObject result = portfolioService.getPortfolioById(artistId);
            if (result == null) {
                JsonUtil.writeJsonError(response, "Portfolio not found");
                return;
            }

            JsonUtil.writeJsonResponse(response, result);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Get the artist ID from the URL
            int artistId = extractArtistId(request.getPathInfo());
            if (artistId == -1) {
                JsonUtil.writeJsonError(response, "Invalid or missing artist ID");
                return;
            }

            // Parse request body
            JSONObject requestBody = JsonUtil.parseRequestBody(request);
            if (requestBody == null) {
                JsonUtil.writeJsonError(response, "Invalid request body");
                return;
            }

            // Update portfolio
            boolean success = portfolioService.updatePortfolio(artistId, requestBody);
            if (!success) {
                JsonUtil.writeJsonError(response, "Failed to update portfolio");
                return;
            }

            // Return updated portfolio
            JSONObject result = portfolioService.getPortfolioById(artistId);
            if (result == null) {
                JsonUtil.writeJsonError(response, "Portfolio not found after update");
                return;
            }

            JsonUtil.writeJsonResponse(response, result);
        } catch (Exception e) {
            handleError(response, e);
        }
    }

    private int extractArtistId(String pathInfo) {
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

    private void handleError(HttpServletResponse response, String message, Exception e) throws IOException {
        e.printStackTrace();
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        JsonUtil.writeJsonError(response, message + ": " + e.getMessage());
    }

    private void handleError(HttpServletResponse response, Exception e) throws IOException {
        handleError(response, "An unexpected error occurred", e);
    }

    @Override
    public void destroy() {
        portfolioService.closeConnections();
        super.destroy();
    }
} 