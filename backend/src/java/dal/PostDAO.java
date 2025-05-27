package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Post;


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
    public void createPost(Post post) {
        try {
            String sql = """
                    INSERT INTO Posts (UserID, Title, Content, IsDraft, Visibility, CreatedAt)
                    VALUES (?, ?, ?, ?, ?, ?);
                    """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, post.getUserID());
            st.setString(2, post.getTitle());
            st.setString(3, post.getContent());
            st.setBoolean(4, post.isDraft());
            st.setString(5, post.getVisibility());
            st.setObject(6, LocalDateTime.now());
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Post> getAllPosts() {
        List<Post> posts = new ArrayList<>();
        try {
            String sql = "SELECT * FROM Posts WHERE IsDeleted = 0 ORDER BY CreatedAt DESC";
            PreparedStatement st = connection.prepareStatement(sql);
            ResultSet rs = st.executeQuery();
            
            while (rs.next()) {
                Post post = new Post(
                    rs.getInt("ID"),
                    rs.getInt("UserID"),
                    rs.getString("Title"),
                    rs.getString("Content"),
                    rs.getBoolean("IsDraft"),
                    rs.getString("Visibility"),
                    rs.getTimestamp("CreatedAt").toLocalDateTime(),
                    rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                    rs.getBoolean("IsDeleted")
                );
                posts.add(post);
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return posts;
    }

    public List<Post> getPostsByUser(int userID) {
        List<Post> posts = new ArrayList<>();
        try {
            String sql = "SELECT * FROM Posts WHERE UserID = ? AND IsDeleted = 0 ORDER BY CreatedAt DESC";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();
            
            while (rs.next()) {
                Post post = new Post(
                    rs.getInt("ID"),
                    rs.getInt("UserID"),
                    rs.getString("Title"),
                    rs.getString("Content"),
                    rs.getBoolean("IsDraft"),
                    rs.getString("Visibility"),
                    rs.getTimestamp("CreatedAt").toLocalDateTime(),
                    rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                    rs.getBoolean("IsDeleted")
                );
                posts.add(post);
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return posts;
    }

    public Post getPost(int postID) {
        Post post = null;
        try {
            String sql = "SELECT * FROM Posts WHERE ID = ? AND IsDeleted = 0";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, postID);
            ResultSet rs = st.executeQuery();
            
            if (rs.next()) {
                post = new Post(
                    rs.getInt("ID"),
                    rs.getInt("UserID"),
                    rs.getString("Title"),
                    rs.getString("Content"),
                    rs.getBoolean("IsDraft"),
                    rs.getString("Visibility"),
                    rs.getTimestamp("CreatedAt").toLocalDateTime(),
                    rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                    rs.getBoolean("IsDeleted")
                );
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return post;
    }

    public void updatePost(Post post) {
        try {
            String sql = """
                    UPDATE Posts 
                    SET Title = ?, 
                        Content = ?, 
                        IsDraft = ?, 
                        Visibility = ?,
                        UpdatedAt = ?
                    WHERE ID = ? AND IsDeleted = 0
                    """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, post.getTitle());
            st.setString(2, post.getContent());
            st.setBoolean(3, post.isDraft());
            st.setString(4, post.getVisibility());
            st.setObject(5, LocalDateTime.now());
            st.setInt(6, post.getID());
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deletePost(int postID) {
        try {
            String sql = "UPDATE Posts SET IsDeleted = 1 WHERE ID = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, postID);
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Post> searchPosts(String keyword) {
        List<Post> posts = new ArrayList<>();
        try {
            String sql = """
                    SELECT * FROM Posts 
                    WHERE IsDeleted = 0 
                    AND (Title LIKE ? OR Content LIKE ?) 
                    ORDER BY CreatedAt DESC
                    """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, "%" + keyword + "%");
            st.setString(2, "%" + keyword + "%");
            ResultSet rs = st.executeQuery();
            
            while (rs.next()) {
                Post post = new Post(
                    rs.getInt("ID"),
                    rs.getInt("UserID"),
                    rs.getString("Title"),
                    rs.getString("Content"),
                    rs.getBoolean("IsDraft"),
                    rs.getString("Visibility"),
                    rs.getTimestamp("CreatedAt").toLocalDateTime(),
                    rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                    rs.getBoolean("IsDeleted")
                );
                posts.add(post);
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return posts;
    }

