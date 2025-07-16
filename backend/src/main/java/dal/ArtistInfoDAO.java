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
        String query = "INSERT INTO ArtistInfo (UserID, PhoneNumber, Address, Specialty, ExperienceYears, eKYC) VALUES (?, ?, ?, ?, ?,?)";

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, userId);
            ps.setString(2, phoneNumber);
            ps.setString(3, address);
            ps.setString(4, specialty);
            ps.setInt(5, experienceYears);
            ps.setBoolean(6, eKYC);
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
}
