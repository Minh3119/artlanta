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
        String sql = "SELECT * FROM Users WHERE ID = ?;";
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

    public boolean updatePasswordHashByID(int userID, String newHash) {
        String sql = "UPDATE Users SET PasswordHash = ? WHERE ID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, newHash);
            st.setInt(2, userID);
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
	
      public String getUNByUserID(int userID) {
        String sql = "SELECT userName FROM Users WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userID);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("username");
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

    public List<User> getUserBySearch(String searchValue) {
        List<User> list = new ArrayList<>();
        String sql = """
            SELECT * FROM Users
            WHERE Username LIKE CONCAT('%', ?, '%')
               OR Email LIKE CONCAT('%', ?, '%')
               OR FullName LIKE CONCAT('%', ?, '%')
        """;
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, searchValue);
            st.setString(2, searchValue);
            st.setString(3, searchValue);
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
                            rs.getBoolean("IsPrivate")
                    );
                    list.add(user);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public boolean isArtistById(int userId) {
        String sql = "SELECT Role FROM Users WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String role = rs.getString("Role");
                    System.out.println("Fetched role for user " + userId + ": " + role);
                    return "ARTIST".equalsIgnoreCase(role != null ? role.trim() : "");
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean setUserRoleToArtist(int userId) {
        String sql = "UPDATE Users SET Role = 'ARTIST' WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            int rowsUpdated = stmt.executeUpdate();
            return rowsUpdated > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean isPasswordMatch(int userId, String newPasswordHash) {
        String sql = "SELECT PasswordHash FROM Users WHERE ID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    String currentHash = rs.getString("PasswordHash");
                    return currentHash != null && currentHash.equals(newPasswordHash.trim());
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean updateBasicProfile(
            int userId,
            String username,
            String fullName,
            String email,
            boolean gender,
            String location,
            String bio,
            LocalDateTime dob
    ) {
        String sql = """
        UPDATE Users SET
            Username = ?,
            FullName = ?,
            Email = ?,
            Gender = ?,
            Location = ?,
            Bio = ?,
            DOB = ?
        WHERE ID = ?
    """;

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, username);
            st.setString(2, fullName);
            st.setString(3, email);
            st.setBoolean(4, gender);
            st.setString(5, location);
            st.setString(6, bio);
            st.setObject(7, dob);
            st.setInt(8, userId);

            return st.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean isUsernameTakenByOthers(String username, int currentUserId) {
        String sql = "SELECT 1 FROM Users WHERE Username = ? AND ID <> ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, username);
            st.setInt(2, currentUserId);
            ResultSet rs = st.executeQuery();
            return rs.next(); // true nếu đã có người khác dùng
        } catch (SQLException e) {
            e.printStackTrace();
            return true; // nếu có lỗi thì giả định là trùng để ngăn lỗi
        }
    }

    public boolean isEmailTakenByOthers(String email, int currentUserId) {
        String sql = "SELECT 1 FROM Users WHERE Email = ? AND ID <> ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, email);
            st.setInt(2, currentUserId);
            ResultSet rs = st.executeQuery();
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return true;
        }
    }
	
	public boolean isEKYCVerified(int userId) {
    String sql = "SELECT eKYC FROM ArtistInfo WHERE UserID = ?";
    
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, userId);
        ResultSet rs = stmt.executeQuery();
        
        if (rs.next()) {
            return rs.getBoolean("eKYC");
        } else {
            return false; // không tìm thấy userID
        }
    } catch (SQLException e) {
        e.printStackTrace();
        return false; 
    }
}

	
	
	
	
	public double getUserEngagementRate(int userId) throws SQLException {
        String sql = """
            SELECT 
                COALESCE(p.total_posts, 0) as total_posts,
                COALESCE(l.total_likes, 0) as total_likes,
                COALESCE(c.total_comments, 0) as total_comments
            FROM Users u
            LEFT JOIN (
                SELECT UserID, COUNT(*) as total_posts 
                FROM Posts 
                WHERE IsDraft = 0 AND UserID = ?
            ) p ON u.ID = p.UserID
            LEFT JOIN (
                SELECT p.UserID, COUNT(l.UserID) as total_likes
                FROM Posts p 
                LEFT JOIN Likes l ON p.ID = l.PostID
                WHERE p.UserID = ?
                GROUP BY p.UserID
            ) l ON u.ID = l.UserID
            LEFT JOIN (
                SELECT p.UserID, COUNT(c.ID) as total_comments
                FROM Posts p 
                LEFT JOIN Comments c ON p.ID = c.PostID
                WHERE p.UserID = ?
                GROUP BY p.UserID
            ) c ON u.ID = c.UserID
            WHERE u.ID = ?
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, userId);
            stmt.setInt(3, userId);
            stmt.setInt(4, userId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int totalPosts = rs.getInt("total_posts");
                int totalLikes = rs.getInt("total_likes");
                int totalComments = rs.getInt("total_comments");
                
                if (totalPosts == 0) return 0.0;
                return (double)(totalLikes + totalComments) / totalPosts;
            }
        }
        return 0.0;
    }
    
    /**
     * 2. Tỷ lệ bài viết bị báo cáo (flagged posts / total posts)
     * Chỉ số quan trọng để phát hiện user có hành vi vi phạm
     */
    public double getUserFlaggedPostRate(int userId) throws SQLException {
        String sql = """
            SELECT 
                COUNT(*) as total_posts,
                SUM(CASE WHEN IsFlagged = 1 THEN 1 ELSE 0 END) as flagged_posts
            FROM Posts 
            WHERE UserID = ? AND IsDraft = 0
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int totalPosts = rs.getInt("total_posts");
                int flaggedPosts = rs.getInt("flagged_posts");
                
                if (totalPosts == 0) return 0.0;
                return (double)flaggedPosts / totalPosts * 100;
            }
        }
        return 0.0;
    }
    
    /**
     * 3. Tỷ lệ thành công Commission (completed / total requests)
     * Chỉ số đánh giá độ tin cậy của artist
     */
    public double getArtistCommissionSuccessRate(int artistId) throws SQLException {
        String sql = """
            SELECT 
                COUNT(*) as total_commissions,
                SUM(CASE WHEN c.Status = 'COMPLETED' THEN 1 ELSE 0 END) as completed_commissions
            FROM CommissionRequest cr
            JOIN Commission c ON cr.ID = c.RequestID
            WHERE cr.ArtistID = ? AND cr.Status = 'ACCEPTED'
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, artistId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int totalCommissions = rs.getInt("total_commissions");
                int completedCommissions = rs.getInt("completed_commissions");
                
                if (totalCommissions == 0) return 0.0;
                return (double)completedCommissions / totalCommissions * 100;
            }
        }
        return 0.0;
    }
    
    /**
     * 4. Tỷ lệ active user (số ngày hoạt động / tổng số ngày từ khi tạo tài khoản)
     * Chỉ số đánh giá mức độ tích cực của user
     */

    
    /**
     * 5. Tỷ lệ follower/following ratio
     * Chỉ số đánh giá mức độ ảnh hưởng và chất lượng nội dung
     */
    public double getUserFollowerRatio(int userId) throws SQLException {
        String sql = """
            SELECT 
                COALESCE(followers.count, 0) as follower_count,
                COALESCE(following.count, 0) as following_count
            FROM Users u
            LEFT JOIN (
                SELECT FollowedID, COUNT(*) as count 
                FROM Follows 
                WHERE Status = 'ACCEPTED' AND FollowedID = ?
                GROUP BY FollowedID
            ) followers ON u.ID = followers.FollowedID
            LEFT JOIN (
                SELECT FollowerID, COUNT(*) as count 
                FROM Follows 
                WHERE Status = 'ACCEPTED' AND FollowerID = ?
                GROUP BY FollowerID
            ) following ON u.ID = following.FollowerID
            WHERE u.ID = ?
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, userId);
            stmt.setInt(3, userId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int followerCount = rs.getInt("follower_count");
                int followingCount = rs.getInt("following_count");
                
                if (followingCount == 0) return followerCount > 0 ? Double.MAX_VALUE : 0.0;
                return (double)followerCount / followingCount;
            }
        }
        return 0.0;
    }
    
    /**
     * 6. Tỷ lệ comment spam (comments có từ khóa spam hoặc quá ngắn)
     * Chỉ số phát hiện hành vi spam comment
     */
    public double getUserSpamCommentRate(int userId) throws SQLException {
        String sql = """
            SELECT 
                COUNT(*) as total_comments,
                SUM(CASE 
                    WHEN LENGTH(TRIM(Content)) <= 3 
                    OR Content REGEXP '(http|www\\.|bit\\.ly|tinyurl)' 
                    OR Content REGEXP '^[!@#$%^&*(),.?":{}|<>]*$'
                    THEN 1 ELSE 0 
                END) as spam_comments
            FROM Comments 
            WHERE UserID = ? AND IsFlagged = 0
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int totalComments = rs.getInt("total_comments");
                int spamComments = rs.getInt("spam_comments");
                
                if (totalComments == 0) return 0.0;
                return (double)spamComments / totalComments * 100;
            }
        }
        return 0.0;
    }
    
    /**
     * 7. Tỷ lệ livestream engagement (viewers + comments / total streams)
     * Chỉ số đánh giá chất lượng livestream
     */
    public double getUserLiveStreamEngagement(int userId) throws SQLException {
        String sql = """
            SELECT 
                COUNT(lp.ID) as total_streams,
                COALESCE(SUM(lp.LiveView), 0) as total_views,
                COALESCE(COUNT(lcm.ID), 0) as total_comments
            FROM LivePosts lp
            LEFT JOIN LiveChatMessages lcm ON lp.ID = lcm.LivePostID
            WHERE lp.UserID = ?
            GROUP BY lp.UserID
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int totalStreams = rs.getInt("total_streams");
                int totalViews = rs.getInt("total_views");
                int totalComments = rs.getInt("total_comments");
                
                if (totalStreams == 0) return 0.0;
                return (double)(totalViews + totalComments) / totalStreams;
            }
        }
        return 0.0;
    }
    
    /**
     * 8. Tỷ lệ giao dịch thành công (completed transactions / total transactions)
     * Chỉ số đánh giá độ tin cậy trong giao dịch tài chính
     */
    public double getUserTransactionSuccessRate(int userId) throws SQLException {
        String sql = """
            SELECT 
                COUNT(*) as total_transactions,
                SUM(CASE WHEN Status = 'completed' OR Status = 'success' THEN 1 ELSE 0 END) as successful_transactions
            FROM Transactions 
            WHERE UserID = ? 
            AND TransactionType IN ('deposit', 'withdraw', 'donate_send', 'donate_receive')
        """;
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                int totalTransactions = rs.getInt("total_transactions");
                int successfulTransactions = rs.getInt("successful_transactions");
                
                if (totalTransactions == 0) return 0.0;
                return (double)successfulTransactions / totalTransactions * 100;
            }
        }
        return 0.0;
    }
}
