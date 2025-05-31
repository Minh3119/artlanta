package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Media;
import model.Post;
import util.JsonUtil;

public class PostDAO extends DBContext {

    public void createPost(Post post, List<Media> list) throws SQLException {
        PreparedStatement pstPost = null, pstMedia = null, pstPostMedia = null;

        try {
            connection.setAutoCommit(false);
            pstPost = connection.prepareStatement("""
                                                insert into Posts (UserID, Title, Content, IsDraft, Visibility, CreatedAt)
                                                VALUES (?, ?, ?, ?, ?, ?);
                                                """,
                    Statement.RETURN_GENERATED_KEYS);

            pstPost.setInt(1, post.getUserID());
            pstPost.setString(2, post.getTitle());
            pstPost.setString(3, post.getContent());
            pstPost.setBoolean(4, post.isDraft());
            pstPost.setString(5, post.getVisibility());
            pstPost.setObject(6, LocalDateTime.now());
            pstPost.executeUpdate();
            ResultSet rsPost = pstPost.getGeneratedKeys();
            rsPost.next();
            int postId = rsPost.getInt(1);

            pstMedia = connection.prepareStatement("""
                                                 insert into Media(URL)
                                                 values(?);
                                                 """,
                    Statement.RETURN_GENERATED_KEYS);
            pstPostMedia = connection.prepareStatement("""
                                                      insert into PostMedia(PostID,MediaID)
                                                      values(?,?);
                                                      """,
                    Statement.RETURN_GENERATED_KEYS);
            for (Media m : list) {
                pstMedia.setString(1, m.getURL());
                pstMedia.executeUpdate();
                ResultSet rsMedia = pstMedia.getGeneratedKeys();
                rsMedia.next();
                int mediaId = rsMedia.getInt(1);

                pstPostMedia.setInt(1, postId);
                pstPostMedia.setInt(2, mediaId);
                pstPostMedia.executeUpdate();
            }

            connection.commit();
        } catch (SQLException e) {
            if (connection != null) {
                connection.rollback();
            }
            e.printStackTrace();
        } finally {
            if (pstPostMedia != null) {
                pstPostMedia.close();
            }
            if (pstMedia != null) {
                pstMedia.close();
            }
            if (pstPost != null) {
                pstPost.close();
            }
            if (connection != null) {
                connection.setAutoCommit(true);
                connection.close();
            }
        }
    }

    //especially for get the autogenID
//    public int createPostReturnID(Post post) {
//        int postID=0;
//        try {
//            String sql = """
//                    INSERT INTO Posts (UserID, Title, Content, IsDraft, Visibility, CreatedAt)
//                    VALUES (?, ?, ?, ?, ?, ?);
//                    """;
//            PreparedStatement st = connection.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);
//            st.setInt(1, post.getUserID());
//            st.setString(2, post.getTitle());
//            st.setString(3, post.getContent());
//            st.setBoolean(4, post.isDraft());
//            st.setString(5, post.getVisibility());
//            st.setObject(6, LocalDateTime.now());
//            st.executeUpdate();
//            
//            //return the auto-geng ID
//            ResultSet rs = st.getGeneratedKeys();
//            if (rs.next()) {
//                postID = rs.getInt(1);
//            }
//            st.close();
//        } catch (SQLException e) {
//            e.printStackTrace();
//        }
//        return postID;
//    }
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
        String sql = "SELECT * FROM Posts WHERE ID = ?";
        try {
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
                        rs.getBoolean("IsFlagged")
                );
            }
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
}
