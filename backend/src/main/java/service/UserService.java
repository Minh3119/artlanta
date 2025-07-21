package service;

import dal.CommissionDAO;
import model.User;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import dal.UserDAO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.sql.SQLException;
import java.util.List;
import java.time.LocalDateTime;
import model.Commission;
import static util.SessionUtil.getCurrentUserId;

public class UserService {

    public UserService() {
    }

    public JSONObject getUsersByRole(String role) throws JSONException {
        if (role == null || role.trim().isEmpty()) {
            throw new IllegalArgumentException("Role parameter cannot be empty");
        }

        UserDAO userDAO = new UserDAO();
        try {
            List<User> users = userDAO.getByRole(role);
            JSONArray jsonUsers = convertUsersToJsonArray(users);
            
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("response", jsonUsers);
            return jsonResponse;
        } finally {
            if (userDAO != null) {
                userDAO.closeConnection();
            }
        }
    }

    public JSONObject getUserById(int userId, HttpServletRequest request) throws JSONException, SQLException {
        UserDAO userDAO = new UserDAO();
        try {
            User user = userDAO.getOne(userId);
            if (user == null) {
                return null;
            }

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("response", convertUserToJson(user, request));
            return jsonResponse;
        } finally {
            if (userDAO != null) {
                userDAO.closeConnection();
            }
        }
    }

    private JSONArray convertUsersToJsonArray(List<User> users) throws JSONException {
        if (users == null) {
            return new JSONArray();
        }
	
        JSONArray jsonUsers = new JSONArray();
        for (User user : users) {
            try {
                JSONObject jsonUser = new JSONObject();
                jsonUser.put("id", user.getID());
                jsonUser.put("username", user.getUsername());
                jsonUser.put("fullName", user.getFullName());
                jsonUser.put("avatarURL", user.getAvatarURL());
                jsonUser.put("gender", user.getGender());
                jsonUser.put("role", user.getRole());
                jsonUser.put("status", user.getStatus());
                jsonUser.put("language", user.getLanguage());
                jsonUser.put("isPrivate", user.isPrivate());
                jsonUser.put("isFlagged", user.isFlagged());
                jsonUser.put("createdAt", formatDateTime(user.getCreatedAt()));
                jsonUser.put("lastLogin", formatDateTime(user.getLastLogin()));
	       
                jsonUsers.put(jsonUser);
            } catch (Exception e) {
                // Log the error for this user but continue processing others
                e.printStackTrace();
            }
        }
		
        return jsonUsers;
    }

    public JSONObject convertUserToJson(User user, HttpServletRequest request) throws JSONException, SQLException {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }	
		HttpSession session = request.getSession(false);
		Integer currentUserId = getCurrentUserId(session);
		CommissionDAO cdao = new CommissionDAO();
		UserDAO udao=new UserDAO();
        JSONObject jsonUser = new JSONObject();
        try {
            jsonUser.put("id", user.getID());
            jsonUser.put("username", user.getUsername());
            jsonUser.put("fullName", user.getFullName());
            jsonUser.put("bio", user.getBio());
            jsonUser.put("avatarURL", user.getAvatarURL());
            jsonUser.put("gender", user.getGender());
            jsonUser.put("location", user.getLocation());
            jsonUser.put("role", user.getRole());
            jsonUser.put("status", user.getStatus());
            jsonUser.put("language", user.getLanguage());
            jsonUser.put("isPrivate", user.isPrivate());
            jsonUser.put("isFlagged", user.isFlagged());
            jsonUser.put("createdAt", formatDateTime(user.getCreatedAt()));
            jsonUser.put("lastLogin", formatDateTime(user.getLastLogin()));
	   jsonUser.put("isVerify", udao.isEKYCVerified(user.getID()));
	    jsonUser.put("hasARe", cdao.hasPendingRequest(currentUserId, user.getID()));
        } catch (JSONException e) {
            // Log the error and rethrow
            System.err.println("Error converting user to JSON: " + e.getMessage());
            throw e;
        }
		cdao.closeConnection();
		udao.closeConnection();
        return jsonUser;
    }

    private String formatDateTime(LocalDateTime dateTime) {
        return dateTime != null ? dateTime.toString() : null;
    }

} 