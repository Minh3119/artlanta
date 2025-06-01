package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class FollowDAO extends DBContext {
    
    public int getFollowersCount(int userId) {
        int count = 0;
        try {
            String sql = "SELECT COUNT(*) as count FROM Follows WHERE FollowingID = ? AND Status = 'ACCEPTED'";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userId);
            ResultSet rs = st.executeQuery();
            
            if (rs.next()) {
                count = rs.getInt("count");
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return count;
    }
    
    public int getFollowingCount(int userId) {
        int count = 0;
        try {
            String sql = "SELECT COUNT(*) as count FROM Follows WHERE FollowerID = ? AND Status = 'ACCEPTED'";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userId);
            ResultSet rs = st.executeQuery();
            
            if (rs.next()) {
                count = rs.getInt("count");
            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return count;
    }
} 