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

    public void updateUser(User user) {
        String sql = """
                UPDATE Users SET
                Username = ?,
                Email = ?,
                FullName = ?,
                Bio = ?,
                AvatarURL = ?,
                Gender = ?,
                DOB = ?,
                Location = ?,
                Role = ?,
                Status = ?,
                Language = ?,
                LastLogin = ?,
                IsFlagged = ?,
                IsPrivate = ?
                WHERE ID = ?
                """;
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, user.getUsername());
            st.setString(2, user.getEmail());
            st.setString(3, user.getFullName());
            st.setString(4, user.getBio());
            st.setString(5, user.getAvatarURL());
            st.setBoolean(6, user.getGender());
            st.setObject(7, user.getDOB());
            st.setString(8, user.getLocation());
            st.setString(9, user.getRole());
            st.setString(10, user.getStatus());
            st.setString(11, user.getLanguage());
            st.setObject(12, user.getLastLogin());
            st.setBoolean(13, user.isFlagged());
            st.setBoolean(14, user.isPrivate());
            st.setInt(15, user.getID());

            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<User> getAll() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM Users WHERE Status = 'ACTIVE";
        try (PreparedStatement stmt = connection.prepareStatement(sql);
                ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                User user = new User(
                        rs.getInt("ID"),
                        rs.getString("Username"),
                        rs.getString("Email"),
                        rs.getString("PasswordHash"),
                        rs.getString("FullName"),
                        rs.getString("Bio"),
                        rs.getString("AvatarURL"),
                        rs.getBoolean("Gender"),
                        rs.getTimestamp("DOB") != null ? rs.getTimestamp("DOB").toLocalDateTime() : null,
                        rs.getString("Location"),
                        rs.getString("Role"),
                        rs.getString("Status"),
                        rs.getString("Language"),
                        rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null,
                        rs.getTimestamp("LastLogin") != null ? rs.getTimestamp("LastLogin").toLocalDateTime() : null,
                        rs.getBoolean("IsFlagged"),
                        rs.getBoolean("IsPrivate"));
                list.add(user);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public User getOne(int userID) {
        User user = null;
        String sql = "SELECT * FROM Users WHERE ID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userID);
            st.closeOnCompletion();
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    user = new User(
                            rs.getInt("ID"),
                            rs.getString("Username"),
                            rs.getString("Email"),
                            rs.getString("PasswordHash"),
                            rs.getString("FullName"),
                            rs.getString("Bio"),
                            rs.getString("AvatarURL"),
                            rs.getBoolean("Gender"),
                            rs.getTimestamp("DOB") != null ? rs.getTimestamp("DOB").toLocalDateTime() : null,
                            rs.getString("Location"),
                            rs.getString("Role"),
                            rs.getString("Status"),
                            rs.getString("Language"),
                            rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null,
                            rs.getTimestamp("LastLogin") != null ? rs.getTimestamp("LastLogin").toLocalDateTime() : null,
                            rs.getBoolean("IsFlagged"),
                            rs.getBoolean("IsPrivate"));
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    public List<User> getByRole(String role) {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM Users WHERE Role = ? AND Status = 'ACTIVE'";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, role.toUpperCase());
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    User user = new User(
                            rs.getInt("ID"),
                            rs.getString("Username"),
                            rs.getString("Email"),
                            rs.getString("PasswordHash"),
                            rs.getString("FullName"),
                            rs.getString("Bio"),
                            rs.getString("AvatarURL"),
                            rs.getBoolean("Gender"),
                            rs.getTimestamp("DOB") != null ? rs.getTimestamp("DOB").toLocalDateTime() : null,
                            rs.getString("Location"),
                            rs.getString("Role"),
                            rs.getString("Status"),
                            rs.getString("Language"),
                            rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null,
                            rs.getTimestamp("LastLogin") != null ? rs.getTimestamp("LastLogin").toLocalDateTime() : null,
                            rs.getBoolean("IsFlagged"),
                            rs.getBoolean("IsPrivate"));
                    list.add(user);
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

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

    // get all notifications with userId
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
