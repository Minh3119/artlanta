package controller;

import dal.FollowDAO;
import model.Follow;
import model.User;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet("/api/follow")
public class FollowServlet extends HttpServlet {

    private FollowDAO followDAO = new FollowDAO();

    @Override
    protected void doPost(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("account") : null;
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"Not logged in\"}");
            return;
        }

        String action = request.getParameter("action");
        int targetId = Integer.parseInt(request.getParameter("targetId"));

        boolean result = false;
        if ("follow".equals(action)) {
            result = followDAO.follow(user.getID(), targetId);
        } else if ("unfollow".equals(action)) {
            result = followDAO.unfollow(user.getID(), targetId);
        }
        out.print("{\"success\":" + result + "}");
    }

    @Override
    protected void doGet(HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("account") : null;
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"error\":\"Not logged in\"}");
            return;
        }

        String type = request.getParameter("type");
        int userId = Integer.parseInt(request.getParameter("userId"));

        if ("count".equals(type)) {
            int count = followDAO.countFollowers(userId);
            out.print("{\"count\":" + count + "}");
        } else if ("list".equals(type)) {
            List<Follow> followers = followDAO.getFollowers(userId);
            StringBuilder sb = new StringBuilder();
            sb.append("[");
            for (int i = 0; i < followers.size(); i++) {
                Follow f = followers.get(i);
                sb.append("{\"id\":").append(f.getId())
                  .append(",\"followerId\":").append(f.getFollowerId())
                  .append(",\"followingId\":").append(f.getFollowingId())
                  .append(",\"status\":\"").append(f.getStatus()).append("\"")
                  .append(",\"followAt\":\"").append(f.getFollowAt()).append("\"}");
                if (i < followers.size() - 1) sb.append(",");
            }
            sb.append("]");
            out.print(sb.toString());
        } else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"error\":\"Invalid type\"}");
        }
    }
}
