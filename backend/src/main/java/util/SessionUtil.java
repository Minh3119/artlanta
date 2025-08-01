package util;

import jakarta.servlet.http.HttpSession;

/**
 * Utility class for managing user sessions
 */
public class SessionUtil {

    // Key used to store user ID in session
    private static final String USER_ID_KEY = "userId";
    private static final String USER_NAME = "user";

    /**
     * Stores the user ID in the session when user logs in
     *
     * @param session The HttpSession object
     * @param userId The ID of the logged-in user
     */
    public static void storeUserInSession(HttpSession session, int userId) {
        if (session != null) {
            session.setAttribute(USER_ID_KEY, userId);
        }
    }

    public static void storeUserNameInSession(HttpSession session, String UserName) {
        if (session != null) {
            session.setAttribute(USER_NAME, UserName);
        }
    }

    /**
     * Retrieves the user ID of the currently logged-in user
     *
     * @param session The HttpSession object
     * @return The user ID if logged in, or null if no user is logged in
     */
    public static Integer getCurrentUserId(HttpSession session) {
        if (session != null) {
            Object userId = session.getAttribute(USER_ID_KEY);
            return userId != null ? (Integer) userId : null;
        }
        return null;
    }
    
    public static String getCurrentUserName(HttpSession session) {
        if (session != null) {
            Object userName = session.getAttribute(USER_NAME);
            return userName != null ? (String) userName : null;
        }
        return null;
    }

    /**
     * Checks if any user is currently logged in
     *
     * @param session The HttpSession object
     * @return true if a user is logged in, false otherwise
     */
    public static boolean isLoggedIn(HttpSession session) {
        return getCurrentUserId(session) != null;
    }

    /**
     * Invalidates the session when user logs out
     *
     * @param session The HttpSession object
     */
    public static void logout(HttpSession session) {
        if (session != null) {
            session.invalidate();
        }
    }
}
