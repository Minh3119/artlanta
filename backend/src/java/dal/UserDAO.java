package dal;

import java.security.Timestamp;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.User;
//import model.Post;
//import model.SavedPost;

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
        String sql = "SELECT * FROM Users ";
        try (PreparedStatement stmt = connection.prepareStatement(sql); ResultSet rs = stmt.executeQuery()) {
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
            rs.close();
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

    public User getUserByEmailAndPassword(String email, String password) {
        User user = null;
        try {
            String sql = "SELECT * FROM Users WHERE Email = ? AND PasswordHash = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, email);
            st.setString(2, password);
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
                        rs.getBoolean("IsFlagged"),
                        rs.getBoolean("IsPrivate")
                );
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    public boolean checkUserExistsByUserName(String username) {
        boolean exists = false;
        try {
            String sql = "SELECT * FROM Users WHERE Username = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, username);
            ResultSet rs = st.executeQuery();
            exists = rs.next();
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return exists;
    }

    public boolean checkUserExistsByEmail(String email) {
        boolean exists = false;
        try {
            String sql = "SELECT * FROM Users WHERE Email = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, email);
            ResultSet rs = st.executeQuery();
            exists = rs.next();
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return exists;
    }

    public User getUserByEmail(String email) {
        User user = null;
        try {
            String sql = "SELECT * FROM Users WHERE Email = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, email);
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
                        rs.getBoolean("IsFlagged"),
                        rs.getBoolean("IsPrivate")
                );
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }

    public void registerUser(String username, String email, String passwordHash, String role) {
        String sql = """
        INSERT INTO Users (Username, Email, PasswordHash, Gender, Role, Status, Language, IsPrivate, IsFlagged)
        VALUES (?, ?, ?, 0, ?, 'ACTIVE', 'vn', 0, 0)
    """;

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, username);
            st.setString(2, email);
            st.setString(3, passwordHash);
            st.setString(4, role);
            st.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean updatePasswordHashByEmail(String email, String newHash) {
        String sql = "UPDATE Users SET PasswordHash = ? WHERE Email = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, newHash);
            st.setString(2, email);
            st.executeUpdate();

            return true;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public int getUserIdByEmail(String email) {
        int userId = -1; // giá trị mặc định nếu không tìm thấy
        String sql = "SELECT ID FROM Users WHERE Email = ?";

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    userId = rs.getInt("ID");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return userId;
    }

    public String getAvatarByUserID(int userID) {
        String sql = "SELECT AvatarURL FROM Users WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userID);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("AvatarURL");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<User> getUsersByIds(List<Integer> userIds) {
        List<User> result = new ArrayList<>();

        if (userIds == null || userIds.isEmpty()) {
            return result;
        }

        StringBuilder userIdsFormat = new StringBuilder();
        for (int i = 0; i < userIds.size(); i++) {
            userIdsFormat.append("?");

            if (i < userIds.size() - 1) {
                userIdsFormat.append(", ");
            }
        }

        String sql = "SELECT * FROM Users WHERE ID IN (" + userIdsFormat + ") LIMIT 20";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            for (int i = 0; i < userIds.size(); i++) {
                ps.setInt(i + 1, userIds.get(i));
            }

            try (ResultSet rs = ps.executeQuery()) {
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
                            rs.getBoolean("IsPrivate")
                    );

                    result.add(user);
                }
            }
            ps.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return result;
    }

    public int countUsers() {
        String sql = "SELECT COUNT(ID) FROM users";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int countBannedUsers() {
        String sql = "SELECT COUNT(ID) FROM users WHERE Status='BANNED'";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public int countMod() {
        String sql = "SELECT COUNT(ID) FROM users WHERE Role='Moderator'";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return 0;
    }

    public boolean toggleUserStatus(int userId) {
        String getStatusSql = "SELECT Status FROM Users WHERE ID = ?";
        String updateStatusSql = "UPDATE Users SET Status = ? WHERE ID = ?";

        try (
                PreparedStatement getPs = connection.prepareStatement(getStatusSql); PreparedStatement updatePs = connection.prepareStatement(updateStatusSql)) {
            getPs.setInt(1, userId);
            try (ResultSet rs = getPs.executeQuery()) {
                if (rs.next()) {
                    String currentStatus = rs.getString("Status");
                    String newStatus = currentStatus.equalsIgnoreCase("ACTIVE") ? "BANNED" : "ACTIVE";

                    updatePs.setString(1, newStatus);
                    updatePs.setInt(2, userId);
                    int updated = updatePs.executeUpdate();
                    return updated > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    public LocalDate getMostUserCreatedDate() {
        LocalDate result = null;
        String sql = "SELECT CAST(CreatedAt AS DATE) AS createdDate, COUNT(*) AS total "
                + "FROM Users GROUP BY CAST(CreatedAt AS DATE) ORDER BY total DESC LIMIT 1";

        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                result = rs.getDate("createdDate").toLocalDate();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return result;
    }

    public boolean isUserBanned(String email) {
        String sql = "SELECT Status FROM Users WHERE Email = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return "BANNED".equalsIgnoreCase(rs.getString("Status"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isAdmin(int userId) {
        String sql = "SELECT Role FROM Users WHERE ID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    return "ADMIN".equalsIgnoreCase(rs.getString("Role"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
