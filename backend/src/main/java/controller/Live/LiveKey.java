package controller.Live;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public class LiveKey extends HttpServlet {

    private static final List<String> activeStreams = new ArrayList<>();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String streamKey = request.getParameter("key");
        activeStreams.add(streamKey);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String streamKey = request.getParameter("key");
        activeStreams.add(streamKey);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
