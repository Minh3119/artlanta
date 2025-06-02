package controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.module.ModuleDescriptor.Requires;

import org.json.JSONObject;

import com.cloudinary.http44.api.Response;

import util.JsonUtil;
import service.PortfolioService;

@WebServlet("/api/portfolio/*")
public class PortfolioServlet extends HttpServlet {
    private final PortfolioService portfolioService;

    public PortfolioServlet() {
        this.portfolioService = new PortfolioService();
    }

    /*  GET /api/portfolio/*

        Returns the portfolio for the given artist id.

        Response JSON structure:
        {
            "response": {
                "coverUrl": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop",
                "createdAt": "2025-04-01T07:00",
                "achievements": "Đạt giải nhất cuộc thi tranh kỹ thuật số 2024",
                "description": "Bộ sưu tập tranh kỹ thuật số phong cách hiện đại.",
                "artistId": 1,
                "media": [
                {
                    "createdAt": "2025-04-01 07:00:00.0",
                    "description": "Cute character illustration",
                    "id": 1,
                    "url": "https://i.pinimg.com/736x/0e/e2/f5/0ee2f5afea2a6dc5108298b410751cc8.jpg"
                },
                {
                    "createdAt": "2025-04-01 07:00:00.0",
                    "description": "Nature-themed character",
                    "id": 2,
                    "url": "https://i.pinimg.com/736x/70/87/f5/7087f520a25d2c76052ebdbd593e849a.jpg"
                }
                ],
                "title": "Digital Art Collection"
            }
        }

        Notes:
        - Returns 404 if the artist or their portfolio is not found.
    */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Get the artist ID from the URL
            int artistId = portfolioService.extractArtistId(request.getPathInfo());
            if (artistId == -1) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                JsonUtil.writeJsonError(response, "Invalid or missing artist ID");
                return;
            }

            // Get the portfolio by artist ID
            JSONObject result = portfolioService.getPortfolioById(artistId);
            if (result == null) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                JsonUtil.writeJsonError(response, "Portfolio not found");
                return;
            }

            JsonUtil.writeJsonResponse(response, result);
        } catch (Exception e) {
            handleError(response, e);
        }
    }


    /*  PUT /api/portfolio/*

        Edits the portfolio for the given artist id.

        Response JSON structure (on success):
        {
            "coverUrl": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop",
            "createdAt": "2025-04-01T07:00",
            "achievements": "Đạt giải nhất cuộc thi tranh kỹ thuật số 2024",
            "description": "Bộ sưu tập tranh kỹ thuật số phong cách hiện đại.",
            "artistId": 1,
            "media": [
            {
                "createdAt": "2025-04-01 07:00:00.0",
                "description": "Cute character illustration",
                "id": 1,
                "url": "https://i.pinimg.com/736x/0e/e2/f5/0ee2f5afea2a6dc5108298b410751cc8.jpg"
            },
            {
                "createdAt": "2025-04-01 07:00:00.0",
                "description": "Nature-themed character",
                "id": 2,
                "url": "https://i.pinimg.com/736x/70/87/f5/7087f520a25d2c76052ebdbd593e849a.jpg"
            }
            ],
            "title": "Digital Art Collection"
        }

        Notes:
        - Client sent an invalid or missing parameter (artistId) -> returns 400
        - Malformed or missing JSON body -> returns 400
        - Failed to update portfolio -> returns 500
        - Portfolio not found after update -> returns 500
    */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            // Get the artist ID from the URL
            int artistId = portfolioService.extractArtistId(request.getPathInfo());
            if (artistId == -1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                JsonUtil.writeJsonError(response, "Invalid or missing artist ID");
                return;
            }

            // Parse request body
            JSONObject requestBody = JsonUtil.parseRequestBody(request);
            if (requestBody == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                JsonUtil.writeJsonError(response, "Invalid request body");
                return;
            }

            // Update portfolio
            boolean success = portfolioService.updatePortfolio(artistId, requestBody);
            if (!success) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
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