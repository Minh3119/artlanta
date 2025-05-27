package dal;

import dal.DBContext;
import model.Post;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PostDAO extends DBContext {

    public void insert(Post post) {
        String sql = "INSERT INTO Posts (UserID, Title, Content, IsDraft, Visibility, CreatedAt, UpdatedAt, IsDeleted) " +
                     "VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, post.getUserId());
            stmt.setString(2, post.getTitle());
            stmt.setString(3, post.getContent());
            stmt.setBoolean(4, post.isDraft());
            stmt.setString(5, post.getVisibility());
            stmt.setTimestamp(6, Timestamp.valueOf(post.getUpdatedAt()));
            stmt.setBoolean(7, post.isDeleted());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public Post getById(int id) {
        String sql = "SELECT * FROM Posts WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return extractPost(rs);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Post> getAll() {
        List<Post> list = new ArrayList<>();
        String sql = "SELECT * FROM Posts WHERE IsDeleted = 0";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                list.add(extractPost(rs));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public void update(Post post) {
        String sql = "UPDATE Posts SET Title = ?, Content = ?, IsDraft = ?, Visibility = ?, UpdatedAt = NOW(), IsDeleted = ? WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, post.getTitle());
            stmt.setString(2, post.getContent());
            stmt.setBoolean(3, post.isDraft());
            stmt.setString(4, post.getVisibility());
            stmt.setBoolean(5, post.isDeleted());
            stmt.setInt(6, post.getId());
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void softDelete(int id) {
        String sql = "UPDATE Posts SET IsDeleted = 1 WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            stmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private Post extractPost(ResultSet rs) throws SQLException {
        Post post = new Post();
        post.setId(rs.getInt("ID"));
        post.setUserId(rs.getInt("UserID"));
        post.setTitle(rs.getString("Title"));
        post.setContent(rs.getString("Content"));
        post.setDraft(rs.getBoolean("IsDraft"));
        post.setVisibility(rs.getString("Visibility"));
        post.setCreatedAt(rs.getTimestamp("CreatedAt").toLocalDateTime());
        Timestamp updated = rs.getTimestamp("UpdatedAt");
        post.setUpdatedAt(updated != null ? updated.toLocalDateTime() : null);
        post.setDeleted(rs.getBoolean("IsDeleted"));
        return post;
    }
}
