package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.UserSocialLink;

public class UserSocialLinkDAO extends DBContext {
    
    public List<UserSocialLink> getByUserId(int userId) {
        List<UserSocialLink> links = new ArrayList<>();
        String sql = "SELECT * FROM UserSocialLinks WHERE UserID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            try (ResultSet rs = st.executeQuery()) {
                while (rs.next()) {
                    UserSocialLink link = new UserSocialLink();
                    link.setId(rs.getInt("ID"));
                    link.setUserId(rs.getInt("UserID"));
                    link.setPlatform(rs.getString("Platform"));
                    link.setUrl(rs.getString("URL"));
                    link.setCreatedAt(rs.getTimestamp("CreatedAt"));
                    links.add(link);
                }
            } catch (SQLException e) {
                System.out.println("Error getting social links: " + e.getMessage());
            }
        } catch (SQLException e) {
            System.out.println("Error getting social links: " + e.getMessage());
        }
        return links;
    }
} 