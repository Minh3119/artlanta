/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;

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
}
