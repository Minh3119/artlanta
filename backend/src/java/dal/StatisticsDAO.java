package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Statistics;

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
}
