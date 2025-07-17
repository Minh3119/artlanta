package controller;

import service.CommissionService;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import util.SessionUtil;
import util.JsonUtil;
import java.io.IOException;

import org.json.JSONObject;

@WebServlet("/commissions")
public class CommissionServlet extends HttpServlet {
    private final CommissionService commissionService = new CommissionService();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (!SessionUtil.isLoggedIn(session)) {
            JsonUtil.writeJsonError(response, "User not logged in", HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        int userId = SessionUtil.getCurrentUserId(session);
        JSONObject commissions = commissionService.getCommissionsByUserId(userId);
        JsonUtil.writeJsonResponse(response, commissions);
    }
} 