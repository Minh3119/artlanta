package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Portfolio;

public class PortfolioDAO extends DBContext {
    
    public Portfolio getByArtistId(int artistId) {
        String sql = "SELECT * FROM Portfolio WHERE ArtistID = ?";
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, artistId);
            ResultSet rs = st.executeQuery();
            
            if (rs.next()) {
                Portfolio portfolio = new Portfolio();
                portfolio.setArtistId(rs.getInt("ArtistID"));
                portfolio.setTitle(rs.getString("Title"));
                portfolio.setDescription(rs.getString("Description"));
                portfolio.setCoverUrl(rs.getString("CoverURL"));
                portfolio.setAchievements(rs.getString("Achievements"));
                portfolio.setCreatedAt(rs.getTimestamp("CreatedAt"));
                return portfolio;
            }
        } catch (SQLException e) {
            System.out.println("Error getting portfolio: " + e.getMessage());
        }
        return null;
    }
} 