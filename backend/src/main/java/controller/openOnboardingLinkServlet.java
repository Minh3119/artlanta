/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.AccountLink;
import com.stripe.param.AccountLinkCreateParams;
import dal.ArtistInfoDAO;
import dal.UserDAO;
import java.io.IOException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import model.User;
import org.json.JSONObject;
import util.MailSender;
import util.SessionUtil;
import validation.EnvConfig;

/**
 *
 * @author anhkt
 */
@WebServlet(name = "openOnboardingLinkServlet", urlPatterns = {"/api/stripe/onboardinglink"})
public class openOnboardingLinkServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        JSONObject json = new JSONObject();
        Integer userId = SessionUtil.getCurrentUserId(request.getSession(false));

        if (userId == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            json.put("success", false);
            json.put("message", "User not logged in.");
            response.getWriter().write(json.toString());
            return;
        }

        try {
            ArtistInfoDAO artistInfoDAO = new ArtistInfoDAO();
            String stripeAccountId = artistInfoDAO.getStripeAccountId(userId);

            if (stripeAccountId == null || stripeAccountId.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                json.put("success", false);
                json.put("message", "Stripe account not found.");
                response.getWriter().write(json.toString());
                return;
            }

            EnvConfig config = new EnvConfig();
            Stripe.apiKey = config.getProperty("stripe_secret");

            // 3. Tạo account link
            AccountLinkCreateParams params = AccountLinkCreateParams.builder()
                    .setAccount(stripeAccountId)
                    .setRefreshUrl("http://localhost:3000/")
                    .setReturnUrl("http://localhost:3000/")
                    .setType(AccountLinkCreateParams.Type.ACCOUNT_ONBOARDING)
                    .build();

            AccountLink link = AccountLink.create(params);

            UserDAO userDao = new UserDAO();
            User user = userDao.getOne(userId);

            boolean sendMail = MailSender.sendEmail(user.getEmail(), link.getUrl(), getServletContext());
            if (sendMail) {
                json.put("success", true);
                json.put("message", "Link đã đăng nhập đã được gửi tới email của bạn");
            } else {
                json.put("success", false);
                json.put("message", "Gửi email không thành công");
            }

            userDao.closeConnection();
            artistInfoDAO.closeConnection();
            response.getWriter().write(json.toString());

        } catch (StripeException e) {
            e.printStackTrace();
            response.setStatus(500);
            json.put("success", false);
            json.put("message", "Stripe error: " + e.getMessage());
            response.getWriter().write(json.toString());
        }
    }
}
