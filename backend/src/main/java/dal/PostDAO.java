package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Comment;
import model.Media;
import model.Post;
import model.User;
import util.JsonUtil;

public class PostDAO extends DBContext {

    public void createPost(Post post, List<Media> list) throws SQLException {
        PreparedStatement pstPost = null, pstMedia = null, pstPostMedia = null;

        try {
            connection.setAutoCommit(false);
            pstPost = connection.prepareStatement("""
                                                insert into Posts (UserID, Content, IsDraft, Visibility, CreatedAt)
                                                VALUES (?, ?, ?, ?, ?);
                                                """,
                    Statement.RETURN_GENERATED_KEYS);

            pstPost.setInt(1, post.getUserID());
            pstPost.setString(2, post.getContent());
            pstPost.setBoolean(3, post.isDraft());
            pstPost.setString(4, post.getVisibility());
            pstPost.setObject(5, LocalDateTime.now());
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
            pstPostMedia.close();
            pstMedia.close();
            pstPost.close();
            if (connection != null) {
                connection.setAutoCommit(true);
                connection.close();
            }
        }
    }
    public List<String> getAllImage(int UserID){
        List<String> list= new ArrayList();
        String sql= """
                    SELECT m.URL AS imageURL
                    FROM Users u
                    JOIN Posts p ON u.ID = p.UserID
                    JOIN PostMedia pm ON p.ID = pm.PostID
                    JOIN Media m ON pm.MediaID = m.ID
                    WHERE u.ID = ?;
                    """;
        try{
            PreparedStatement st = connection.prepareStatement(sql);
	   st.setInt(1, UserID);
           ResultSet rs= st.executeQuery();
           while(rs.next()){
               list.add(rs.getString("URL"));
           }
           
           rs.close();
           st.close();
            
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return list;
    }

    public List<Post> getAllPosts(int offset, int limit) {
        List<Post> posts = new ArrayList<>();
        try {
            String sql = "SELECT * FROM Posts ORDER BY CreatedAt DESC LIMIT ?,?";
            PreparedStatement st = connection.prepareStatement(sql);
	   st.setInt(1, offset);
            st.setInt(2, limit);
            ResultSet rs = st.executeQuery();

            while (rs.next()) {
                Post post = new Post(
                        rs.getInt("ID"),
                        rs.getInt("UserID"),
                        rs.getString("Content"),
                        rs.getBoolean("IsDraft"),
                        rs.getString("Visibility"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime(),
                        rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                        rs.getBoolean("IsFlagged")
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
                        rs.getString("Content"),
                        rs.getBoolean("IsDraft"),
                        rs.getString("Visibility"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime(),
                        rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                        rs.getBoolean("IsFlagged")
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
                        rs.getString("Content"),
                        rs.getBoolean("IsDraft"),
                        rs.getString("Visibility"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime(),
                        rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                        rs.getBoolean("IsFlagged")
                );
            }
            st.close();
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return post;
    }

    public void updatePost(Post post, int postID) {
        try {
            String sql = """
                    UPDATE Posts 
                    SET 
                        Content = ?, 
                        IsDraft = ?, 
                        Visibility = ?,
                        UpdatedAt = ?
                    WHERE ID = ? AND IsFlagged = 0
                    """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, post.getContent());
            st.setBoolean(2, post.isDraft());
            st.setString(3, post.getVisibility());
            st.setObject(4, null);
            st.setInt(5, postID);
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deletePost(int postID) throws SQLException {
        PreparedStatement pstMedia = null, pstPost = null;

        try {
            connection.setAutoCommit(false);
            //delete
            pstMedia = connection.prepareStatement("""
                                                       delete FROM Media WHERE ID IN (SELECT MediaID FROM PostMedia WHERE PostID = ?);
                                                       """);
            pstMedia.setInt(1, postID);
            pstMedia.executeUpdate();

            pstPost = connection.prepareStatement("""
                                                 delete from Posts where ID=?
                                                 """);

            pstPost.setInt(1, postID);
            pstPost.executeUpdate();

            connection.commit();
        } catch (SQLException e) {
            if (connection != null) {
                connection.rollback();
            }

            e.printStackTrace();
        } finally {
            pstMedia.close();
            pstPost.close();
            connection.setAutoCommit(true);
            connection.close();

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
                        rs.getString("Content"),
                        rs.getBoolean("IsDraft"),
                        rs.getString("Visibility"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime(),
                        rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
                        rs.getBoolean("IsFlagged")
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

    public int getLikeCount(int postId) {
        int count = 0;
        try {
            String sql = """
                SELECT COUNT(*) AS LikeCount
                FROM Likes
                WHERE PostID = ?
                """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, postId);
            ResultSet rs = st.executeQuery();

            if (rs.next()) {
                count = rs.getInt("LikeCount");
            }

            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return count;
    }

    public int getCommentCount(int postId) {
        int count = 0;
        try {
            String sql = """
                SELECT COUNT(*) AS CommentCount
                FROM Comments
                WHERE PostID = ?
                """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, postId);
            ResultSet rs = st.executeQuery();

            if (rs.next()) {
                count = rs.getInt("CommentCount");
            }

            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return count;
    }

    public List<String> getImageUrlsByPostId(int postId) {
        List<String> imageUrls = new ArrayList<>();
        String sql = """
            SELECT m.URL
            FROM Media m
            JOIN PostMedia pm ON m.ID = pm.MediaID
            WHERE pm.PostID = ?
        """;

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                imageUrls.add(rs.getString("URL"));
            }
            ps.close();
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return imageUrls;
    }

    public List<Comment> getCommentsByPostId(int postId) {
        List<Comment> comments = new ArrayList<>();
        String sql = """
            SELECT * FROM Comments
            WHERE PostID = ? AND IsFlagged = 0
            ORDER BY CreatedAt ASC
        """;

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                Comment c = new Comment(
                        rs.getInt("ID"),
                        rs.getInt("PostID"),
                        rs.getInt("UserID"),
                        rs.getString("Content"),
                        rs.getString("MediaURL"),
                        rs.getObject("ParentID") != null ? rs.getInt("ParentID") : null,
                        rs.getTimestamp("CreatedAt").toLocalDateTime(),
                        rs.getBoolean("IsFlagged")
                );
                comments.add(c);
            }
            ps.close();
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return comments;
    }

    public String getAvatarByPostId(int postId, int cmtId) {
        String sql = "SELECT u.AvatarURL FROM Comments c JOIN Users u ON c.UserID = u.ID  JOIN Posts p on c.PostID=p.ID WHERE p.ID = ? AND c.ID=?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, postId);
            stmt.setInt(2, cmtId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("AvatarURL");
            }
            stmt.close();
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
    //getFNByPostId

    public String getFNByPostId(int postId, int cmtId) {
        String sql = "SELECT u.FullName FROM Comments c JOIN Users u ON c.UserID = u.ID  JOIN Posts p on c.PostID=p.ID WHERE p.ID = ? AND c.ID=?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, postId);
            stmt.setInt(2, cmtId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return rs.getString("FullName");
            }
            stmt.close();
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean insertComment(int postId, int userId, String content) {
        String sql = "INSERT INTO Comments (PostID, UserID, Content) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, postId);
            stmt.setInt(2, userId);
            stmt.setString(3, content);
            int rowsInserted = stmt.executeUpdate();
            stmt.close();
            return rowsInserted > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public List<Post> getPostBySearch(String searchValue) {
        List<Post> list = new ArrayList<>();
        String sql = """
                        SELECT Posts.ID, posts.Content,posts.CreatedAt,posts.Visibility, Users.Username 
                        FROM Posts
                        JOIN Users ON Posts.UserID = Users.ID
                        WHERE Posts.Content LIKE CONCAT('%', ?, '%')
                            OR Users.Username LIKE CONCAT('%', ?, '%')
                        ORDER BY Posts.ID DESC;
                       """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, searchValue);
            st.setString(2, searchValue);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                list.add(new Post(rs.getInt("ID"), rs.getString("Content"), rs.getString("Visibility"), rs.getTimestamp("CreatedAt").toLocalDateTime(), rs.getString("Username")));
            }
            st.close();
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

}
