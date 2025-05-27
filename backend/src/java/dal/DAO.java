package dal;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import model.UserHistory;
import model.Posts;
import dal.DBContext;
import java.sql.Statement;
import java.sql.Types;


public class DAO extends DBContext {

    public String createPost(int userId, String title, String content, String mediaUrl,
                             boolean isDraft, String visibility) {
        String sql = "INSERT INTO posts (UserID, Title, Content, MediaURL, IsDraft, Visibility, CreatedAt, UpdatedAt, IsDeleted) " +
                "VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), 0)";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            ps.setString(2, title);
            ps.setString(3, content);
            ps.setString(4, mediaUrl);
            ps.setBoolean(5, isDraft);
            ps.setString(6, visibility);

            int rows = ps.executeUpdate();
            return rows > 0 ? "Post created successfully." : "Failed to create post.";

        } catch (SQLException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    public String editPost(int postId, String title, String content, String mediaUrl,
                           boolean isDraft, String visibility) {
        String sql = "UPDATE posts SET Title = ?, Content = ?, MediaURL = ?, IsDraft = ?, Visibility = ?, UpdatedAt = NOW() WHERE ID = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, title);
            ps.setString(2, content);
            ps.setString(3, mediaUrl);
            ps.setBoolean(4, isDraft);
            ps.setString(5, visibility);
            ps.setInt(6, postId);

            int rows = ps.executeUpdate();
            return rows > 0 ? "Post updated successfully." : "No post was updated.";
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    public String deletePost(int postId) {
        String sql = "UPDATE posts SET IsDeleted = 1, UpdatedAt = NOW() WHERE ID = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, postId);

            int rows = ps.executeUpdate();
            return rows > 0 ? "Post deleted (soft delete) successfully." : "No post was deleted.";
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    public String addUserHistory(int userId, int postId, int artistId) {
        String sql = "INSERT INTO userhistory (UserID, PostID, ArtistID, ViewedAt) VALUES (?, ?, ?, NOW())";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            ps.setInt(2, postId);
            ps.setInt(3, artistId);

            int rows = ps.executeUpdate();
            return rows > 0 ? "User history added." : "Failed to add user history.";
        } catch (SQLException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }

    public List<UserHistory> getUserHistoryByUserId(int userId) {
        List<UserHistory> list = new ArrayList<>();
        String sql = "SELECT * FROM userhistory WHERE UserID = ? ORDER BY ViewedAt DESC";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                UserHistory history = new UserHistory();
                history.setId(rs.getInt("ID"));
                history.setUserId(rs.getInt("UserID"));
                history.setPostId(rs.getInt("PostID"));
                history.setArtistId(rs.getInt("ArtistID"));
                history.setViewedAt(rs.getTimestamp("ViewedAt"));
                list.add(history);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }


}
