package controller.Event;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import dal.EventDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import model.Event;
import util.JsonUtil;
import util.SessionUtil;

/**
 * Servlet handling event creation requests
 * Endpoint: /api/events/create
 * Method: POST
 * 
 * Request body should be JSON with the following fields:
 * - title: string (required)
 * - description: string (required)
 * - startTime: string (ISO datetime format, required)
 * - endTime: string (ISO datetime format, required)
 * - location: string (required)
 * - imageUrl: string (optional)
 */
@WebServlet(name = "CreateEventServlet", urlPatterns = {"/api/events/create"})
public class CreateEventServlet extends HttpServlet {
    // Dependencies
    private final EventDAO eventDAO;
    private final Gson gson;
    
    /**
     * Constructor - initializes dependencies
     */
    public CreateEventServlet() {
        this.eventDAO = new EventDAO();
        this.gson = JsonUtil.getGson();
    }
    
    /**
     * Handles POST requests for event creation
     * 
     * Steps:
     * 1. Validates user authentication
     * 2. Parses request body
     * 3. Creates event in database
     * 4. Returns created event data
     * 
     * @param request The HTTP request
     * @param response The HTTP response
     * @throws ServletException If a servlet error occurs
     * @throws IOException If an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Set response type
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            // Check user authentication
            Integer userId = SessionUtil.getUserId(request);
            if (userId == null) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"User not logged in\"}");
                return;
            }
            
            // Parse request body
            JsonObject body = gson.fromJson(request.getReader(), JsonObject.class);
            
            // Create event object from request data
            Event event = new Event();
            event.setTitle(body.get("title").getAsString());
            event.setDescription(body.get("description").getAsString());
            event.setStartTime(LocalDateTime.parse(body.get("startTime").getAsString()));
            event.setEndTime(LocalDateTime.parse(body.get("endTime").getAsString()));
            event.setLocation(body.get("location").getAsString());
            event.setCreatorId(userId);
            
            // Set optional image URL if provided
            if (body.has("imageUrl") && !body.get("imageUrl").isJsonNull()) {
                event.setImageUrl(body.get("imageUrl").getAsString());
            }
            
            // Create event in database
            Event createdEvent = eventDAO.createEvent(event);
            
            // Send response
            if (createdEvent != null) {
                response.setStatus(HttpServletResponse.SC_CREATED);
                response.getWriter().write(gson.toJson(createdEvent));
            } else {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("{\"error\": \"Failed to create event\"}");
            }
            
        } catch (Exception e) {
            // Handle any errors
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
} 