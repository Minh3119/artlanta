package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Portfolio;

public class PortfolioDAO extends DBContext {
    
    public Portfolio getByArtistId(int artistId) {
        String sql = "SELECT * FROM Portfolio WHERE ArtistID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, artistId);
            try (ResultSet rs = st.executeQuery()) {
                if (rs.next()) {
                    Portfolio portfolio = new Portfolio(
                        rs.getInt("ArtistID"),
                        rs.getString("Title"),
                        rs.getString("Description"), 
                        rs.getString("CoverURL"),
                        rs.getString("Achievements"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime()
                    );
                    return portfolio;
                }
            } catch (SQLException e) {
                System.out.println("Error getting portfolio: " + e.getMessage());
            }
        } catch (SQLException e) {
            System.out.println("Error getting portfolio: " + e.getMessage());
        }
        return null;
    }

    public boolean update(Portfolio portfolio) {
        String sql = "UPDATE Portfolio SET Title = ?, Description = ?, CoverURL = ?, Achievements = ? WHERE ArtistID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, portfolio.getTitle());
            st.setString(2, portfolio.getDescription());
            st.setString(3, portfolio.getCoverURL());
            st.setString(4, portfolio.getAchievements());
            st.setInt(5, portfolio.getArtistID());
            
            int rowsAffected = st.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException e) {
            System.out.println("Error updating portfolio: " + e.getMessage());
            return false;
        }
    }
} 