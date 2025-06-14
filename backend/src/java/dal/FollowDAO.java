package dal;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import model.Follow;

// ==================== Follow Data Access Object ====================
// Handles all database operations related to follow functionality
public class FollowDAO extends DBContext {

    // -------------------- Core Follow Actions --------------------
    /**
     * Creates a new follow relationship between users
     *
     * @param followerId The user who is following
     * @param followingId The user being followed
     * @return boolean indicating success of the operation
     */
    public boolean follow(int followerId, int followingId) {
        String sql = "INSERT INTO Follows (followerId, followingId, status, followAt) VALUES (?, ?, 'ACCEPTED', CURRENT_TIMESTAMP)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followingId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Removes a follow relationship between users
     *
     * @param followerId The user who is unfollowing
     * @param followingId The user being unfollowed
     * @return boolean indicating success of the operation
     */
    public boolean unfollow(int followerId, int followingId) {
        String sql = "DELETE FROM Follows WHERE followerId = ? AND followingId = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followingId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    // -------------------- Follow Counts --------------------
    /**
     * Counts how many followers a user has
     *
     * @param userId The user whose followers are being counted
     * @return The number of followers
     */
    public int countFollowers(int userId) {
        String sql = "SELECT COUNT(*) FROM Follows WHERE followingId = ? AND status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    /**
     * Counts how many users a user is following
     *
     * @param userId The user whose following count is being checked
     * @return The number of users being followed
     */
    public int countFollowing(int userId) {
        String sql = "SELECT COUNT(*) FROM Follows WHERE followerId = ? AND status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    // -------------------- Follow Lists --------------------
    /**
     * Retrieves the list of followers for a user
     *
     * @param userId The user whose followers are being retrieved
     * @return List of Follow objects containing follower information
     */
    public List<Follow> getFollowers(int userId) {
        List<Follow> followers = new ArrayList<>();
        String sql = "SELECT f.*, u.Username, u.AvatarURL FROM Follows f "
                + "JOIN Users u ON f.followerId = u.ID "
                + "WHERE f.followingId = ? AND f.status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Follow f = new Follow();
                f.setId(rs.getInt("id"));
                f.setFollowerId(rs.getInt("followerId"));
                f.setFollowingId(rs.getInt("followingId"));
                f.setStatus(rs.getString("status"));
                f.setFollowAt(rs.getTimestamp("followAt").toLocalDateTime());
                f.setUsername(rs.getString("Username"));
                f.setAvatarUrl(rs.getString("AvatarURL"));
                followers.add(f);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return followers;
    }

    /**
     * Retrieves the list of users that a user is following
     *
     * @param userId The user whose following list is being retrieved
     * @return List of Follow objects containing following information
     */
    public List<Follow> getFollowing(int userId) {
        List<Follow> following = new ArrayList<>();
        String sql = "SELECT f.*, u.Username, u.AvatarURL FROM Follows f "
                + "JOIN Users u ON f.followingId = u.ID "
                + "WHERE f.followerId = ? AND f.status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Follow f = new Follow();
                f.setId(rs.getInt("id"));
                f.setFollowerId(rs.getInt("followerId"));
                f.setFollowingId(rs.getInt("followingId"));
                f.setStatus(rs.getString("status"));
                f.setFollowAt(rs.getTimestamp("followAt").toLocalDateTime());
                f.setUsername(rs.getString("Username"));
                f.setAvatarUrl(rs.getString("AvatarURL"));
                following.add(f);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return following;
    }

    // -------------------- Follow Status --------------------
    /**
     * Checks if one user is following another
     *
     * @param followerId The potential follower
     * @param followingId The potential user being followed
     * @return boolean indicating if the follow relationship exists
     */
    public boolean isFollowing(int followerId, int followingId) {
        String sql = "SELECT COUNT(*) FROM Follows WHERE followerId = ? AND followingId = ? AND status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followingId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // -------------------- Aggregate Counts --------------------
    /**
     * Gets both follower and following counts for a user
     *
     * @param userId The user whose counts are being retrieved
     * @return Map containing both follower and following counts
     */
    public Map<String, Integer> getFollowerCounts(int userId) {
        Map<String, Integer> counts = new HashMap<>();
        String followersSql = "SELECT COUNT(*) FROM Follows WHERE followingId = ? AND status = 'ACCEPTED'";
        String followingSql = "SELECT COUNT(*) FROM Follows WHERE followerId = ? AND status = 'ACCEPTED'";

        try {
            // Get followers count
            PreparedStatement ps = connection.prepareStatement(followersSql);
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                counts.put("followers", rs.getInt(1));
            }

            // Get following count
            ps = connection.prepareStatement(followingSql);
            ps.setInt(1, userId);
            rs = ps.executeQuery();
            if (rs.next()) {
                counts.put("following", rs.getInt(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            counts.put("followers", 0);
            counts.put("following", 0);
        }
        return counts;
    }

    public List<Integer> getTop5FollowedUserIDs() {
        List<Integer> userIds = new ArrayList<>();
        String sql = """
        SELECT f.FollowingID AS UserID
        FROM Follows f
        WHERE f.Status = 'ACCEPTED'
        GROUP BY f.FollowingID
        ORDER BY COUNT(*) DESC
        LIMIT 5
    """;

        try (PreparedStatement st = connection.prepareStatement(sql); ResultSet rs = st.executeQuery()) {

            while (rs.next()) {
                userIds.add(rs.getInt("UserID"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return userIds;
    }

    public List<Integer> getSuggestedFollowUserIds(int userId) {
        List<Integer> suggestedUserIds = new ArrayList<>();

        String sql = """
        SELECT DISTINCT C.FollowerID AS SuggestedUserID
        FROM Follows A
        JOIN Follows C ON A.FollowingID = C.FollowingID
        WHERE A.FollowerID = ?
          AND A.Status = 'ACCEPTED'
          AND C.Status = 'ACCEPTED'
          AND C.FollowerID != A.FollowerID
          AND C.FollowerID NOT IN (
              SELECT FollowingID
              FROM Follows
              WHERE FollowerID = A.FollowerID
                AND Status = 'ACCEPTED'
          );
    """;

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    suggestedUserIds.add(rs.getInt("SuggestedUserID"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return suggestedUserIds;
    }
}
