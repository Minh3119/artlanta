package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.User;
//import model.Post;
//import model.SavedPost;
import model.Notification;

public class UserDAO extends DBContext {

    public List<User> getAll() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM Users";
        try {
            PreparedStatement stmt = connection.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                User users = new User(
                        rs.getInt("ID"),
                        rs.getString("Username"),
                        rs.getString("Email"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime(),
                        rs.getString("DisplayName"),
                        rs.getString("Bio"),
                        rs.getString("AvatarURL"),
                        rs.getString("Status"),
                        rs.getString("Role"));

                list.add(users);
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public User getOne(int userID) {
        User u = null;
        try {
            String sql = "SELECT * FROM Users WHERE `Users`.ID = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                u = new User(
                        rs.getInt("ID"),
                        rs.getString("Username"),
                        rs.getString("Email"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime(),
                        rs.getString("DisplayName"),
                        rs.getString("Bio"),
                        rs.getString("AvatarURL"),
                        rs.getString("Status"),
                        rs.getString("Role"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return u;
    }

    // public List<Post> getSavedPostsByUser(int userId) {
    // 	List<Post> savedPosts = new ArrayList<>();
    // 	String sql = "SELECT p.* FROM SavedPost s JOIN Posts p ON s.PostID = p.ID WHERE s.UserID = ?";
    // 	try {
    // 		PreparedStatement stmt = connection.prepareStatement(sql);
    // 		stmt.setInt(1, userId);
    // 		ResultSet rs = stmt.executeQuery();
    // 		while (rs.next()) {
    // 			Post post = new Post(
    // 					rs.getInt("ID"),
    // 					rs.getInt("UserID"),
    // 					rs.getString("Title"),
    // 					rs.getString("Content"),
    // 					rs.getBoolean("IsDraft"),
    // 					rs.getString("Visibility"),
    // 					rs.getBoolean("IsDeleted"));
    // 			savedPosts.add(post);
    // 		}
    // 		rs.close();
    // 		stmt.close();
    // 	} catch (SQLException e) {
    // 		e.printStackTrace();
    // 	}
    // 	return savedPosts;
    // }
    // Save a notification for a post
    public boolean saveNotification(int userId, String type, String content) {
        String sql = "INSERT INTO Notifications (UserID, Type, Content) VALUES (?,?,?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, type);
            stmt.setString(3, content);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            return false;
        }
    }

    //get all notifications with userId
    public List<Notification> getAllNotifications(int userId) {
        List<Notification> notifications = new ArrayList<>();
        String sql = "SELECT * FROM Notifications WHERE UserID = ?";
        try {
            try (PreparedStatement stmt = connection.prepareStatement(sql)) {
                stmt.setInt(1, userId);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        Notification n = new Notification();
                        n.setId(rs.getInt("ID"));
                        n.setPostId(rs.getInt("PostID"));
                        n.setUserId(rs.getInt("UserID"));
                        n.setType(rs.getString("Type"));
                        n.setContent(rs.getString("Content"));
                        n.setRead(rs.getBoolean("IsRead"));
                        notifications.add(n);
                    }
                }
            }
        } catch (SQLException e) {
        }
        return notifications;
    }

}
