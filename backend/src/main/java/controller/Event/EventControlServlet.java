package controller.Event;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import dal.EventDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import model.Event;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@WebServlet(name = "EventControlServlet", urlPatterns = {"/api/events"})
public class EventControlServlet extends HttpServlet {

    // Sử dụng GsonBuilder để hỗ trợ LocalDateTime
    private final Gson gson = new GsonBuilder()
        .registerTypeAdapter(LocalDateTime.class,
            (JsonSerializer<LocalDateTime>) (src, typeOfSrc, context) ->
                src == null ? null :
                new JsonPrimitive(src.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
        )
        .create();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        try {
            EventDAO dao = new EventDAO();
            List<Event> allEvents = dao.getAllEvents(); // đảm bảo hàm này trả danh sách có LocalDateTime hợp lệ

            JsonObject res = new JsonObject();
            res.addProperty("status", "success");
            res.add("events", gson.toJsonTree(allEvents));

            out.print(gson.toJson(res));
        } catch (Exception e) {
            JsonObject err = new JsonObject();
            err.addProperty("status", "error");
            err.addProperty("error", "Internal server error: " + e.getMessage());
            out.print(gson.toJson(err));
        } finally {
            out.close();
        }
    }
}
