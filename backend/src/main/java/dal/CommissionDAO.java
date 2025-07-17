package dal;

import java.sql.*;
import java.util.*;
import dto.CommissionDTO;

public class CommissionDAO extends DBContext {
    // Get all commissions with joined request and user info for a user
    public List<CommissionDTO> getCommissionsWithRequestAndUserByUserId(int userId) throws SQLException {
        List<CommissionDTO> result = new ArrayList<>();
        String sql = "SELECT * FROM Commission c " +
                     "JOIN CommissionRequest cr ON c.RequestID = cr.ID " +
                     "JOIN Users client ON cr.ClientID = client.ID " +
                     "JOIN Users artist ON cr.ArtistID = artist.ID " +
                     "WHERE cr.ClientID = ? OR cr.ArtistID = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CommissionDTO dto = new CommissionDTO();
                    dto.setCommissionId(rs.getInt("commissionId"));
                    dto.setRequestId(rs.getInt("requestId"));
                    dto.setTitle(rs.getString("title"));
                    dto.setDescription(rs.getString("description"));
                    dto.setPrice(rs.getDouble("price"));
                    dto.setDeadline(rs.getTimestamp("deadline") != null ? rs.getTimestamp("deadline").toLocalDateTime() : null);
                    dto.setFileDeliveryURL(rs.getString("fileDeliveryURL"));
                    dto.setStatus(rs.getString("status"));
                    dto.setArtistSeenFinal(rs.getBoolean("artistSeenFinal"));
                    dto.setClientConfirmed(rs.getBoolean("clientConfirmed"));
                    dto.setCreatedAt(rs.getTimestamp("createdAt") != null ? rs.getTimestamp("createdAt").toLocalDateTime() : null);
                    dto.setUpdatedAt(rs.getTimestamp("updatedAt") != null ? rs.getTimestamp("updatedAt").toLocalDateTime() : null);
                    dto.setClientId(rs.getInt("clientId"));
                    dto.setArtistId(rs.getInt("artistId"));
                    dto.setShortDescription(rs.getString("shortDescription"));
                    dto.setReferenceURL(rs.getString("referenceURL"));
                    dto.setProposedPrice(rs.getObject("proposedPrice") != null ? rs.getDouble("proposedPrice") : null);
                    dto.setProposedDeadline(rs.getTimestamp("proposedDeadline") != null ? rs.getTimestamp("proposedDeadline").toLocalDateTime() : null);
                    dto.setRequestStatus(rs.getString("requestStatus"));
                    dto.setArtistReply(rs.getString("artistReply"));
                    dto.setRequestAt(rs.getTimestamp("requestAt") != null ? rs.getTimestamp("requestAt").toLocalDateTime() : null);
                    dto.setRespondedAt(rs.getTimestamp("respondedAt") != null ? rs.getTimestamp("respondedAt").toLocalDateTime() : null);
                    dto.setClientUsername(rs.getString("clientUsername"));
                    dto.setArtistUsername(rs.getString("artistUsername"));
                    dto.setClientAvatarURL(rs.getString("clientAvatarURL"));
                    dto.setArtistAvatarURL(rs.getString("artistAvatarURL"));
                    result.add(dto);
                }
            }
        }
        return result;
    }
} 