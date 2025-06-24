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
import java.io.PrintWriter;
import java.util.List;
import model.Post;

@WebServlet(name = "EventPostServlet", urlPatterns = {"/api/event/post/*"})
public class EventPostServlet extends HttpServlet {
    private final EventDAO eventDAO = new EventDAO();
    private final Gson gson = new Gson();

    /**
     * Handles GET requests to retrieve posts for an event
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        try {
            String pathInfo = request.getPathInfo();
            if (pathInfo == null || pathInfo.equals("/")) {
                response.setStatus(400);
                jsonResponse.addProperty("error", "Event ID is required");
                out.println(gson.toJson(jsonResponse));
                return;
            }

            int eventId = Integer.parseInt(pathInfo.substring(1));
//            List<Post> posts = eventDAO.getEventPosts(eventId);
//
//            jsonResponse.addProperty("status", "success");
//            jsonResponse.add("posts", gson.toJsonTree(posts));
//            out.println(gson.toJson(jsonResponse));

        } catch (NumberFormatException e) {
            response.setStatus(400);
            jsonResponse.addProperty("error", "Invalid event ID format");
            out.println(gson.toJson(jsonResponse));
        } catch (Exception e) {
            response.setStatus(500);
            jsonResponse.addProperty("error", "Internal server error: " + e.getMessage());
            out.println(gson.toJson(jsonResponse));
        }
    }

    /**
     * Handles POST requests to add a post to an event
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        try {
            int eventId = Integer.parseInt(request.getParameter("eventId"));
            int postId = Integer.parseInt(request.getParameter("postId"));

            boolean success = eventDAO.addPostToEvent(eventId, postId);

            if (success) {
                jsonResponse.addProperty("status", "success");
                jsonResponse.addProperty("message", "Post added to event successfully");
            } else {
                response.setStatus(400);
                jsonResponse.addProperty("error", "Failed to add post to event");
            }

            out.println(gson.toJson(jsonResponse));

        } catch (NumberFormatException e) {
            response.setStatus(400);
            jsonResponse.addProperty("error", "Invalid event ID or post ID format");
            out.println(gson.toJson(jsonResponse));
        } catch (Exception e) {
            response.setStatus(500);
            jsonResponse.addProperty("error", "Internal server error: " + e.getMessage());
            out.println(gson.toJson(jsonResponse));
        }
    }

    /**
     * Handles DELETE requests to remove a post from an event
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        JsonObject jsonResponse = new JsonObject();

        try {
            int eventId = Integer.parseInt(request.getParameter("eventId"));
            int postId = Integer.parseInt(request.getParameter("postId"));

            boolean success = eventDAO.removePostFromEvent(eventId, postId);

            if (success) {
                jsonResponse.addProperty("status", "success");
                jsonResponse.addProperty("message", "Post removed from event successfully");
            } else {
                response.setStatus(400);
                jsonResponse.addProperty("error", "Failed to remove post from event");
            }

            out.println(gson.toJson(jsonResponse));

        } catch (NumberFormatException e) {
            response.setStatus(400);
            jsonResponse.addProperty("error", "Invalid event ID or post ID format");
            out.println(gson.toJson(jsonResponse));
        } catch (Exception e) {
            response.setStatus(500);
            jsonResponse.addProperty("error", "Internal server error: " + e.getMessage());
            out.println(gson.toJson(jsonResponse));
        }
    }
} 