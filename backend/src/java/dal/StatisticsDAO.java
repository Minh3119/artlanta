package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Statistics;

public class StatisticsDAO extends DBContext {
    // No need for a Connection field or constructor

    public Statistics getUserStatistics(int userId) throws SQLException {
        Statistics stats = new Statistics();
        stats.setPosts(getCount("SELECT COUNT(*) FROM Posts WHERE UserID = ?", userId));
        stats.setFollowers(getCount("SELECT COUNT(*) FROM Follows WHERE FollowingID = ? AND Status = 'ACCEPTED'", userId));
        stats.setFollowing(getCount("SELECT COUNT(*) FROM Follows WHERE FollowerID = ? AND Status = 'ACCEPTED'", userId));
        stats.setLikesReceived(getCount("SELECT COUNT(*) FROM Likes l JOIN Posts p ON l.PostID = p.ID WHERE p.UserID = ?", userId));
        stats.setCommentsMade(getCount("SELECT COUNT(*) FROM Comments WHERE UserID = ?", userId));
        stats.setRepliesReceived(getCount("SELECT COUNT(*) FROM Comments c JOIN Posts p ON c.PostID = p.ID WHERE p.UserID = ?", userId));
        return stats;
    }

    private int getCount(String sql, int userId) throws SQLException {
        try (PreparedStatement ps = connection.prepareStatement(sql)) { // 'connection' from DBContext
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1);
                }
            }
        }
        return 0;
    }
}
