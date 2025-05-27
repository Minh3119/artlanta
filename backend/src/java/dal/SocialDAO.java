package dal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.SocialLink;


public class SocialDAO extends DBContext{
    public List<SocialLink> getByUserId(int userID) {
        List<SocialLink> list = new ArrayList<>();
        try {
            String sql = "SELECT * FROM UserSocialLinks WHERE UserID = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();
            
            while (rs.next()) {
                SocialLink social = new SocialLink(
                    rs.getInt("ID"),
                    rs.getInt("UserID"),
                    rs.getString("Platform"),
                    rs.getString("URL"),
                    rs.getTimestamp("CreatedAt").toLocalDateTime()
                );
                list.add(social);
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public void updateSocial(List<SocialLink> list, int userID) {
        try {
            // First delete all existing links
            String deleteSql = "DELETE FROM UserSocialLinks WHERE UserID = ?";
            PreparedStatement deleteStmt = connection.prepareStatement(deleteSql);
            deleteStmt.setInt(1, userID);
            deleteStmt.executeUpdate();
            deleteStmt.close();

            // Then insert new ones
            String insertSql = "INSERT INTO UserSocialLinks (UserID, Platform, URL, CreatedAt) VALUES (?, ?, ?, ?)";
            PreparedStatement insertStmt = connection.prepareStatement(insertSql);
            
            for (SocialLink social : list) {
                insertStmt.setInt(1, userID);
                insertStmt.setString(2, social.getPlatform());
                insertStmt.setString(3, social.getUrl());
                insertStmt.setObject(4, LocalDateTime.now());
                insertStmt.executeUpdate();
            }
            insertStmt.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void addSocialLink(int userID, String platform, String url) {
        try {
            String sql = "INSERT INTO UserSocialLinks (UserID, Platform, URL, CreatedAt) VALUES (?, ?, ?, ?)";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userID);
            st.setString(2, platform);
            st.setString(3, url);
            st.setObject(4, LocalDateTime.now());
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deleteSocialLink(int linkID) {
        try {
            String sql = "DELETE FROM UserSocialLinks WHERE ID = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, linkID);
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public SocialLink getSocialLink(int linkID) {
        SocialLink social = null;
        try {
            String sql = "SELECT * FROM UserSocialLinks WHERE ID = ?";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, linkID);
            ResultSet rs = st.executeQuery();
            
            if (rs.next()) {
                social = new SocialLink(
                    rs.getInt("ID"),
                    rs.getInt("UserID"),
                    rs.getString("Platform"),
                    rs.getString("URL"),
                    rs.getTimestamp("CreatedAt").toLocalDateTime()
                );
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return social;
    }
}
