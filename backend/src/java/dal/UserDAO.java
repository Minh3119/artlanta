package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.SocialLink;
import model.User;

public class UserDAO extends DBContext {

    // TODO: Just use getOne bro, no need for getOneToEdit()

    // public User getOneToEdit(int userID) {
    //     User user = null;
    //     try {
    //         String sql = """
    //                     SELECT * FROM Users WHERE ID = ?
    //                     """;
    //         PreparedStatement st = connection.prepareStatement(sql);
    //         st.setInt(1, userID);
    //         ResultSet rs = st.executeQuery();
            
    //         if (rs.next()) {
    //             user = new User(
    //                 rs.getInt("ID"),
    //                 rs.getString("Username"),
    //                 rs.getString("Email"),
    //                 rs.getString("PasswordHash"),
    //                 rs.getString("FullName"),
    //                 rs.getString("Bio"),
    //                 rs.getString("AvatarURL"),
    //                 rs.getBoolean("Gender"),
    //                 rs.getTimestamp("DOB") != null ? rs.getTimestamp("DOB").toLocalDateTime() : null,
    //                 rs.getString("Location"),
    //                 rs.getString("Role"),
    //                 rs.getString("Status"),
    //                 rs.getString("Language"),
    //                 rs.getTimestamp("CreatedAt") != null ? rs.getTimestamp("CreatedAt").toLocalDateTime() : null,
    //                 rs.getTimestamp("LastLogin") != null ? rs.getTimestamp("LastLogin").toLocalDateTime() : null,
    //                 rs.getBoolean("IsFlagged")
    //             );
    //         }
    //     } catch (SQLException e) {
    //         e.printStackTrace();
    //     }
    //     return user;
    // }

    public void updateUser(User user) {
        try {
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
                        IsFlagged = ?
                        WHERE ID = ?
                        """;

            PreparedStatement st = connection.prepareStatement(sql);
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
            st.setInt(14, user.getID());
            
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<User> getAll() {
        List<User> list = new ArrayList<>();
        String sql = "SELECT * FROM Users WHERE Status = 'ACTIVE";
        try {
            PreparedStatement stmt = connection.prepareStatement(sql);
            ResultSet rs = stmt.executeQuery();
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
                    rs.getBoolean("IsFlagged")
                );
                list.add(user);
            }
            rs.close();
            stmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public User getOne(int userID) {
        User user = null;
        try {
            String sql = "SELECT * FROM Users WHERE ID = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();
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
                    rs.getBoolean("IsFlagged")
                );
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    public List<User> getByRole(String role) {
        List<User> list = new ArrayList<>();
        try {
            String sql = "SELECT * FROM Users WHERE Role = ? AND Status = 'ACTIVE'";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, role.toUpperCase());
            ResultSet rs = st.executeQuery();
            
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
                    rs.getBoolean("IsFlagged")
                );
                list.add(user);
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

}
