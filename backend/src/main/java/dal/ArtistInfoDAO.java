/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import model.ArtistInfo;

/**
 *
 * @author anhkt
 */
public class ArtistInfoDAO extends DBContext {

    public ArtistInfo getArtistInfoByUserId(int userId) {
        String query = "SELECT * FROM ArtistInfo WHERE UserID = ?";
        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    ArtistInfo info = new ArtistInfo();
                    info.setUserId(rs.getInt("UserID"));
                    info.setPhoneNumber(rs.getString("PhoneNumber"));
                    info.setSpecialty(rs.getString("Specialty"));
                    info.setExperienceYears(rs.getInt("ExperienceYears"));
                    info.seteKYC(rs.getBoolean("eKYC"));
                    info.setDailySpent(rs.getInt("DailySpent"));
                    info.setStripeAccountId(rs.getString("stripe_account_id"));

                    Timestamp created = rs.getTimestamp("CreatedAt");
                    Timestamp updated = rs.getTimestamp("UpdatedAt");
                    if (created != null) {
                        info.setCreatedAt(created.toLocalDateTime());
                    }
                    if (updated != null) {
                        info.setUpdatedAt(updated.toLocalDateTime());
                    }

                    return info;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean insertArtistInfo(Integer userId, String phoneNumber, String specialty, int experienceYears, boolean eKYC) {
        String query = "INSERT INTO ArtistInfo (UserID, PhoneNumber, Specialty, ExperienceYears, eKYC, DailySpent, stripe_account_id) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement ps = connection.prepareStatement(query)) {
            ps.setInt(1, userId);
            ps.setString(2, phoneNumber);
            ps.setString(3, specialty);
            ps.setInt(4, experienceYears);
            ps.setBoolean(5, eKYC);
            ps.setInt(6, 1000000);
            ps.setString(7, null);

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
                    return rs.getBoolean("eKYC");
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

    public boolean isPhoneNumberTakenByOthers(String phoneNumber, int currentUserId) {
        String sql = "SELECT 1 FROM ArtistInfo WHERE PhoneNumber = ? AND UserID <> ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, phoneNumber);
            ps.setInt(2, currentUserId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return true;
        }
    }

    public boolean updateArtistInfoBasicFields(int userId, String phoneNumber, String specialty, int experienceYears) {
        String sql = """
        UPDATE ArtistInfo
        SET PhoneNumber = ?, Specialty = ?, ExperienceYears = ?
        WHERE UserID = ?
    """;

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, phoneNumber);
            ps.setString(2, specialty);
            ps.setInt(3, experienceYears);
            ps.setInt(4, userId);
            return ps.executeUpdate() > 0;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public ArtistInfo getOne(int userId) {
        ArtistInfo artist = null;
        String sql = "SELECT * FROM ArtistInfo WHERE UserID = ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    artist = new ArtistInfo();
                    artist.setUserId(rs.getInt("UserID"));
                    artist.setPhoneNumber(rs.getString("PhoneNumber"));
                    artist.setSpecialty(rs.getString("Specialty"));
                    artist.setExperienceYears(rs.getInt("ExperienceYears"));
                    artist.seteKYC(rs.getBoolean("eKYC"));
                    artist.setDailySpent(rs.getInt("DailySpent"));
                    artist.setStripeAccountId(rs.getString("stripe_account_id"));

                    if (rs.getTimestamp("CreatedAt") != null) {
                        artist.setCreatedAt(rs.getTimestamp("CreatedAt").toLocalDateTime());
                    }
                    if (rs.getTimestamp("UpdatedAt") != null) {
                        artist.setUpdatedAt(rs.getTimestamp("UpdatedAt").toLocalDateTime());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return artist;
    }
}
