/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;

/**
 *
 * @author anhkt
 */
public class ArtistInfoDAO extends DBContext {

    public boolean insertArtistInfo(Integer userId, String phoneNumber, String address, String specialty, int experienceYears, boolean eKYC) {
        String query = "INSERT INTO ArtistInfo (UserID, PhoneNumber, Address, Specialty, ExperienceYears, eKYC, DailySpent, stripe_account_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, userId);
            ps.setString(2, phoneNumber);
            ps.setString(3, address);
            ps.setString(4, specialty);
            ps.setInt(5, experienceYears);
            ps.setBoolean(6, eKYC);
            ps.setInt(7, 1000000);
            ps.setString(8, null);

            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public boolean updateArtistEKYCToTrue(int userId) {
        String query = "UPDATE ArtistInfo SET eKYC = TRUE WHERE UserID = ?";

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, userId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public boolean isArtistEKYCVerified(int userId) {
        String query = "SELECT eKYC FROM ArtistInfo WHERE UserID = ?";

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getBoolean("eKYC"); // true hoặc false
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return false;
    }

    public boolean updateStripeAccountId(int userId, String stripeAccountId) {
        String sql = "UPDATE ArtistInfo SET stripe_account_id = ? WHERE UserID = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, stripeAccountId);
            ps.setInt(2, userId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public Integer getDailySpent(int userId) {
        String query = "SELECT DailySpent FROM ArtistInfo WHERE UserID = ?";

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("DailySpent");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return 0;
    }

    public boolean reduceDailySpent(int userId, int amount) {
        String sql = "UPDATE ArtistInfo SET DailySpent = DailySpent - ? WHERE UserID = ? AND DailySpent >= ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, amount);
            ps.setInt(2, userId);
            ps.setInt(3, amount);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public String getStripeAccountId(int userId) {
        String sql = "SELECT stripe_account_id FROM ArtistInfo WHERE UserID = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("stripe_account_id");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
