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


    public boolean follow(int followerId, int followedId) {
        String sql = "INSERT INTO Follows (followerId, followedId, status, followAt) VALUES (?, ?, 'ACCEPTED', CURRENT_TIMESTAMP)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followedId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Removes a follow relationship between users
     *
     * @param followerId The user who is unfollowed
     * @param followedId The user being unfollowed
     * @return boolean indicating success of the operation
     */
    public boolean unfollow(int followerId, int followedId) {
        String sql = "DELETE FROM Follows WHERE followerId = ? AND followedId = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followedId);
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
        String sql = "SELECT COUNT(*) FROM Follows WHERE followedId = ? AND status = 'ACCEPTED'";
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
     * Counts how many users a user is followed
     *
     * @param userId The user whose followed count is being checked
     * @return The number of users being followed
     */
    public int countFollowed(int userId) {
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
                + "WHERE f.followedId = ? AND f.status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Follow f = new Follow();
                f.setId(rs.getInt("id"));
                f.setFollowerId(rs.getInt("followerId"));
                f.setFollowedId(rs.getInt("followedId"));
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
     * Retrieves the list of users that a user is followed
     *
     * @param userId The user whose followed list is being retrieved
     * @return List of Follow objects containing followed information
     */
    public List<Follow> getFollowed(int userId) {
        List<Follow> followed = new ArrayList<>();
        String sql = "SELECT f.*, u.Username, u.AvatarURL FROM Follows f "
                + "JOIN Users u ON f.followedId = u.ID "
                + "WHERE f.followerId = ? AND f.status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                Follow f = new Follow();
                f.setId(rs.getInt("id"));
                f.setFollowerId(rs.getInt("followerId"));
                f.setFollowedId(rs.getInt("followedId"));
                f.setStatus(rs.getString("status"));
                f.setFollowAt(rs.getTimestamp("followAt").toLocalDateTime());
                f.setUsername(rs.getString("Username"));
                f.setAvatarUrl(rs.getString("AvatarURL"));
                followed.add(f);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return followed;
    }

    // -------------------- Follow Status --------------------
    /**
     * Checks if one user is followed another
     *
     * @param followerId The potential follower
     * @param followedId The potential user being followed
     * @return boolean indicating if the follow relationship exists
     */
    public boolean isFollowed(int followerId, int followedId) {
        String sql = "SELECT COUNT(*) FROM Follows WHERE followerId = ? AND followedId = ? AND status = 'ACCEPTED'";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followedId);
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
     * Gets both follower and followed counts for a user
     *
     * @param userId The user whose counts are being retrieved
     * @return Map containing both follower and followed counts
     */
    public Map<String, Integer> getFollowerCounts(int userId) {
        Map<String, Integer> counts = new HashMap<>();
        String followersSql = "SELECT COUNT(*) FROM Follows WHERE followedId = ? AND status = 'ACCEPTED'";
        String followedSql = "SELECT COUNT(*) FROM Follows WHERE followerId = ? AND status = 'ACCEPTED'";

        try {
            // Get followers count
            PreparedStatement ps = connection.prepareStatement(followersSql);
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                counts.put("followers", rs.getInt(1));
            }

            // Get followed count
            ps = connection.prepareStatement(followedSql);
            ps.setInt(1, userId);
            rs = ps.executeQuery();
            if (rs.next()) {
                counts.put("followed", rs.getInt(1));
            }
        } catch (SQLException e) {
            e.printStackTrace();
            counts.put("followers", 0);
            counts.put("followed", 0);
        }
        return counts;
    }

    public List<Integer> getTop5FollowedUserIDs() {
        List<Integer> userIds = new ArrayList<>();
        String sql = """
        SELECT f.FollowedID AS UserID
        FROM Follows f
        WHERE f.Status = 'ACCEPTED'
        GROUP BY f.FollowedID
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
        JOIN Follows C ON A.FollowedID = C.FollowedID
        WHERE A.FollowerID = ?
          AND A.Status = 'ACCEPTED'
          AND C.Status = 'ACCEPTED'
          AND C.FollowerID != A.FollowerID
          AND C.FollowerID NOT IN (
              SELECT FollowedID
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
