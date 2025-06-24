package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Statistics;
import model.TopPost;
import model.TopUser;

public class StatisticsDAO extends DBContext {
    public Statistics getUserStatistics(int userId) throws SQLException {
        Statistics stats = new Statistics();
        stats.setPosts(getCount("SELECT COUNT(*) FROM Posts WHERE UserID = ?", userId));
        stats.setFollowers(getCount("SELECT COUNT(*) FROM Follows WHERE FollowingID = ? AND Status = 'ACCEPTED'", userId));
        stats.setFollowing(getCount("SELECT COUNT(*) FROM Follows WHERE FollowerID = ? AND Status = 'ACCEPTED'", userId));
        stats.setLikesReceived(getCount("SELECT COUNT(*) FROM Likes l JOIN Posts p ON l.PostID = p.ID WHERE p.UserID = ?", userId));
        stats.setCommentsMade(getCount("SELECT COUNT(*) FROM Comments WHERE UserID = ?", userId));
        stats.setRepliesReceived(getCount("SELECT COUNT(*) FROM Comments c JOIN Posts p ON c.PostID = p.ID WHERE p.UserID = ?", userId));
        stats.setFlagsReceived(getCount("SELECT COUNT(*) FROM Posts WHERE UserId = ? AND isFlagged = 1", userId));
        stats.setVotesPerPost(getVotesPerPost(userId));
        return stats;
    }

    private int getCount(String sql, int userId) throws SQLException {
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return 0;
    }

    // Calculate average likes per post for the user
    private double getVotesPerPost(int userId) throws SQLException {
        String sql = "SELECT AVG(likeCount) FROM (" +
                     "  SELECT COUNT(*) as likeCount FROM Likes l " +
                     "  JOIN Posts p ON l.PostID = p.ID " +
                     "  WHERE p.UserID = ? " +
                     "  GROUP BY p.ID" +
                     ") as likeCounts";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getDouble(1);
                }
            }
        }
        return 0.0;
    }

    public List<TopPost> getTopPosts(int userId) throws SQLException {
        String sql =
            "SELECT p.ID, p.UserID, p.Title, " +
            "  (SELECT COUNT(*) FROM Likes l WHERE l.PostID = p.ID) AS likeInteractions, " +
            "  (SELECT COUNT(*) FROM Comments c WHERE c.PostID = p.ID) AS commentInteractions, " +
            "  ((SELECT COUNT(*) FROM Likes l WHERE l.PostID = p.ID) + " +
            "   (SELECT COUNT(*) FROM Comments c WHERE c.PostID = p.ID)) AS totalInteractions " +
            "FROM Posts p " +
            "WHERE p.UserID = ? " +
            "ORDER BY totalInteractions DESC";
        List<TopPost> result = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    TopPost tp = new TopPost(
                        rs.getInt("ID"),
                        rs.getInt("UserID"),
                        rs.getString("Title"),
                        rs.getInt("likeInteractions"),
                        rs.getInt("commentInteractions"),
                        rs.getInt("totalInteractions")
                    );
                    result.add(tp);
                }
            }
        }
        return result;
    }

    public List<TopUser> getTopCommenters(int userId) throws SQLException {
        String sql =
            "SELECT u.ID, u.Username, " +
            "  SUM(CASE WHEN l.UserID IS NOT NULL THEN 1 ELSE 0 END) AS likeInteractions, " +
            "  SUM(CASE WHEN c.UserID IS NOT NULL THEN 1 ELSE 0 END) AS commentInteractions, " +
            "  (SUM(CASE WHEN l.UserID IS NOT NULL THEN 1 ELSE 0 END) + " +
            "   SUM(CASE WHEN c.UserID IS NOT NULL THEN 1 ELSE 0 END)) AS totalInteractions " +
            "FROM Posts p " +
            "LEFT JOIN Likes l ON l.PostID = p.ID " +
            "LEFT JOIN Comments c ON c.PostID = p.ID " +
            "LEFT JOIN Users u ON (u.ID = l.UserID OR u.ID = c.UserID) " +
            "WHERE p.UserID = ? AND u.ID IS NOT NULL AND u.ID <> ? " +
            "GROUP BY u.ID, u.Username " +
            "ORDER BY totalInteractions DESC";
        List<TopUser> result = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, userId); // Exclude self
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    TopUser tu = new TopUser(
                        rs.getInt("ID"),
                        rs.getString("Username"),
                        rs.getInt("likeInteractions"),
                        rs.getInt("commentInteractions"),
                        rs.getInt("totalInteractions")
                    );
                    result.add(tu);
                }
            }
        }
        return result;
    }
}
