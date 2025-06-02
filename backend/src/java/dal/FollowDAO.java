package dal;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import model.Follow;

public class FollowDAO extends DBContext {

    // Follow a user (status always "accepted")
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

    // Unfollow a user
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

    // Count followers of a user
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

    // Count how many users this user is following
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

    // View followers of a user
    public List<Follow> getFollowers(int userId) {
        List<Follow> followers = new ArrayList<>();
        String sql = "SELECT f.*, u.Username, u.AvatarURL FROM Follows f " +
                    "JOIN Users u ON f.followerId = u.ID " +
                    "WHERE f.followingId = ? AND f.status = 'ACCEPTED'";
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

    // View users that a user follows
    public List<Follow> getFollowing(int userId) {
        List<Follow> following = new ArrayList<>();
        String sql = "SELECT f.*, u.Username, u.AvatarURL FROM Follows f " +
                    "JOIN Users u ON f.followingId = u.ID " +
                    "WHERE f.followerId = ? AND f.status = 'ACCEPTED'";
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

    // Get both follower and following counts
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
}
