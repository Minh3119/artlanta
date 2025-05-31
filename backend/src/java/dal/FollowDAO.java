package dal;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import model.Follow;

public class FollowDAO extends DBContext {

    // Follow a user (status always "accepted")
    public boolean follow(int followerId, int followingId) {
        String sql = "INSERT INTO Follow (followerId, followingId, status, followAt) VALUES (?, ?, 'accepted', CURRENT_TIMESTAMP)";
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
        String sql = "DELETE FROM Follow WHERE followerId = ? AND followingId = ?";
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
        String sql = "SELECT COUNT(*) FROM Follow WHERE followingId = ? AND status = 'accepted'";
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
        String sql = "SELECT * FROM Follow WHERE followingId = ? AND status = 'accepted'";
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
                followers.add(f);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return followers;
    }
}
