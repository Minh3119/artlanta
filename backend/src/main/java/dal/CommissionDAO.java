package dal;

import dto.CommissionDTO;
import java.sql.*;
import java.util.*;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.CommissionRequest;

public class CommissionDAO extends DBContext {
    public boolean updateCommissionStatus(int commissionId, String status) throws SQLException {
        String sql = "UPDATE Commission SET Status = ?, UpdatedAt = CURRENT_TIMESTAMP WHERE ID = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, status);
            ps.setInt(2, commissionId);
            int affected = ps.executeUpdate();
            return affected > 0;
        }
    }

    // Get all commissions with joined request and user info for a user
    public List<CommissionDTO> getCommissionsWithRequestAndUserByUserId(int userId) throws SQLException {
        List<CommissionDTO> result = new ArrayList<>();
        String sql = "SELECT c.ID AS commissionId, c.RequestID AS requestId, c.Title AS title, c.Description AS description, c.Price AS price, c.Deadline AS deadline, c.FileDeliveryURL AS fileDeliveryURL, c.PreviewImageURL AS previewImageURL, c.Status AS status, c.ArtistSeenFinal AS artistSeenFinal, c.ClientConfirmed AS clientConfirmed, c.CreatedAt AS createdAt, c.UpdatedAt AS updatedAt, " +
                "cr.ClientID AS clientId, cr.ArtistID AS artistId, cr.ShortDescription AS shortDescription, cr.ReferenceURL AS referenceURL, cr.ProposedPrice AS proposedPrice, cr.ProposedDeadline AS proposedDeadline, cr.Status AS requestStatus, cr.ArtistReply AS artistReply, cr.RequestAt AS requestAt, cr.RespondedAt AS respondedAt, " +
                "client.Username AS clientUsername, artist.Username AS artistUsername, client.AvatarURL AS clientAvatarURL, artist.AvatarURL AS artistAvatarURL " +
                "FROM Commission c " +
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
                    dto.setPreviewImageURL(rs.getString("previewImageURL"));
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

    // Overloaded: Get all commissions with joined request and user info for a user, filtered by status
    public List<CommissionDTO> getCommissionsWithRequestAndUserByUserId(int userId, String status) throws SQLException {
        List<CommissionDTO> result = new ArrayList<>();
        String sql = "SELECT c.ID AS commissionId, c.RequestID AS requestId, c.Title AS title, c.Description AS description, c.Price AS price, c.Deadline AS deadline, c.FileDeliveryURL AS fileDeliveryURL, c.PreviewImageURL AS previewImageURL, c.Status AS status, c.ArtistSeenFinal AS artistSeenFinal, c.ClientConfirmed AS clientConfirmed, c.CreatedAt AS createdAt, c.UpdatedAt AS updatedAt, " +
                "cr.ClientID AS clientId, cr.ArtistID AS artistId, cr.ShortDescription AS shortDescription, cr.ReferenceURL AS referenceURL, cr.ProposedPrice AS proposedPrice, cr.ProposedDeadline AS proposedDeadline, cr.Status AS requestStatus, cr.ArtistReply AS artistReply, cr.RequestAt AS requestAt, cr.RespondedAt AS respondedAt, " +
                "client.Username AS clientUsername, artist.Username AS artistUsername, client.AvatarURL AS clientAvatarURL, artist.AvatarURL AS artistAvatarURL " +
                "FROM Commission c " +
                "JOIN CommissionRequest cr ON c.RequestID = cr.ID " +
                "JOIN Users client ON cr.ClientID = client.ID " +
                "JOIN Users artist ON cr.ArtistID = artist.ID " +
                "WHERE (cr.ClientID = ? OR cr.ArtistID = ?)";
        if (status != null && !status.isEmpty()) {
            sql += " AND c.Status = ?";
        }
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setInt(2, userId);
            if (status != null && !status.isEmpty()) {
                ps.setString(3, status);
            }
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
                    dto.setPreviewImageURL(rs.getString("previewImageURL"));
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

    public CommissionDTO getCommissionByIdAndUser(int commissionId, int userId) throws SQLException {
        String sql = "SELECT c.ID AS commissionId, c.RequestID AS requestId, c.Title AS title, c.Description AS description, c.Price AS price, c.Deadline AS deadline, c.FileDeliveryURL AS fileDeliveryURL, c.PreviewImageURL AS previewImageURL, c.Status AS status, c.ArtistSeenFinal AS artistSeenFinal, c.ClientConfirmed AS clientConfirmed, c.CreatedAt AS createdAt, c.UpdatedAt AS updatedAt, " +
                "cr.ClientID AS clientId, cr.ArtistID AS artistId, cr.ShortDescription AS shortDescription, cr.ReferenceURL AS referenceURL, cr.ProposedPrice AS proposedPrice, cr.ProposedDeadline AS proposedDeadline, cr.Status AS requestStatus, cr.ArtistReply AS artistReply, cr.RequestAt AS requestAt, cr.RespondedAt AS respondedAt, " +
                "client.Username AS clientUsername, artist.Username AS artistUsername, client.AvatarURL AS clientAvatarURL, artist.AvatarURL AS artistAvatarURL " +
                "FROM Commission c " +
                "JOIN CommissionRequest cr ON c.RequestID = cr.ID " +
                "JOIN Users client ON cr.ClientID = client.ID " +
                "JOIN Users artist ON cr.ArtistID = artist.ID " +
                "WHERE c.ID = ? AND (cr.ClientID = ? OR cr.ArtistID = ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, commissionId);
            ps.setInt(2, userId);
            ps.setInt(3, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    CommissionDTO dto = new CommissionDTO();
                    dto.setCommissionId(rs.getInt("commissionId"));
                    dto.setRequestId(rs.getInt("requestId"));
                    dto.setTitle(rs.getString("title"));
                    dto.setDescription(rs.getString("description"));
                    dto.setPrice(rs.getDouble("price"));
                    dto.setDeadline(rs.getTimestamp("deadline") != null ? rs.getTimestamp("deadline").toLocalDateTime() : null);
                    dto.setFileDeliveryURL(rs.getString("fileDeliveryURL"));
                    dto.setPreviewImageURL(rs.getString("previewImageURL"));
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
                    return dto;
                }
            }
        }
        return null;
    }

    public boolean updateCommission(int commissionId, int userId, String title, String description, double price) throws SQLException {
        // Only allow update if user is client or artist
        String sql = "UPDATE Commission c " +
                     "JOIN CommissionRequest cr ON c.RequestID = cr.ID " +
                     "SET c.Title = ?, c.Description = ?, c.Price = ?, c.UpdatedAt = CURRENT_TIMESTAMP " +
                     "WHERE c.ID = ? AND (cr.ClientID = ? OR cr.ArtistID = ?)";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, title);
            ps.setString(2, description);
            ps.setDouble(3, price);
            ps.setInt(4, commissionId);
            ps.setInt(5, userId);
            ps.setInt(6, userId);
            int affected = ps.executeUpdate();
            return affected > 0;
        }
    }

    public boolean submitCommission(int commissionId, int userId, String fileDeliveryURL, String previewImageURL) throws SQLException {
        // Only allow update if user is the artist
        String sql = "UPDATE Commission c " +
                     "JOIN CommissionRequest cr ON c.RequestID = cr.ID " +
                     "SET c.FileDeliveryURL = ?, c.PreviewImageURL = ?, c.ArtistSeenFinal = TRUE, c.Status = 'COMPLETED', c.UpdatedAt = CURRENT_TIMESTAMP " +
                     "WHERE c.ID = ? AND cr.ArtistID = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setString(1, fileDeliveryURL);
            ps.setString(2, previewImageURL);
            ps.setInt(3, commissionId);
            ps.setInt(4, userId);
            int affected = ps.executeUpdate();
            return affected > 0;
        } 
    }

    // Kiểm tra nếu đã tồn tại request đang chờ duyệt từ client đến artist
    public boolean hasPendingRequest(int clientID, int artistID) {
    String sql = "SELECT COUNT(*) FROM CommissionRequest WHERE ClientID = ? AND ArtistID = ? AND Status = 'PENDING'";
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, clientID);
        stmt.setInt(2, artistID);
        try (ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        }
    } catch (SQLException e) {
        e.printStackTrace(); // hoặc ghi log bằng logger
    }
    return false;
}


    // Chỉ insert nếu không có request nào đang pending
    public boolean insertCommissionRequest(CommissionRequest req) throws SQLException {
        if (hasPendingRequest(req.getClientID(), req.getArtistID())) {
            return false; // Không được insert nếu đang có request pending
        }

        String sql = "INSERT INTO CommissionRequest (ClientID, ArtistID, ShortDescription, ReferenceURL, ProposedPrice, ProposedDeadline) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, req.getClientID());
            stmt.setInt(2, req.getArtistID());
            stmt.setString(3, req.getShortDescription());
            stmt.setString(4, req.getReferenceURL());
            stmt.setDouble(5, req.getProposedPrice());
            stmt.setTimestamp(6, req.getProposedDeadline() != null ? Timestamp.valueOf(req.getProposedDeadline())   : null);
            stmt.executeUpdate();
            return true;
        }
    }

    // Đổi trạng thái request
    public void updateRequestStatus(int requestId, String newStatus, String artistReply) throws SQLException {
        String sql = "UPDATE CommissionRequest SET Status = ?, ArtistReply = ?, RespondedAt = CURRENT_TIMESTAMP WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, newStatus);
            stmt.setString(2, artistReply);
            stmt.setInt(3, requestId);
            stmt.executeUpdate();
        }
    }

    // Xóa request nếu chưa được accepted
    public void deleteRequest(int requestId) throws SQLException {
        String sql = "DELETE FROM CommissionRequest WHERE ID = ? AND Status != 'ACCEPTED'";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, requestId);
            stmt.executeUpdate();
        }
    }

    // Client confirms final product
    public boolean confirmCommissionByClient(int commissionId, int clientId) throws SQLException {
        String sql = "UPDATE Commission c " +
                     "JOIN CommissionRequest cr ON c.RequestID = cr.ID " +
                     "SET c.ClientConfirmed = TRUE, c.Status = 'COMPLETED', c.UpdatedAt = CURRENT_TIMESTAMP " +
                     "WHERE c.ID = ? AND cr.ClientID = ?";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, commissionId);
            ps.setInt(2, clientId);
            int affected = ps.executeUpdate();
            return affected > 0;
        }
    }
	
   public List<CommissionRequest> getPendingRequestsByArtistID(int artistID) {
    List<CommissionRequest> list = new ArrayList<>();
    String sql = "SELECT * FROM CommissionRequest WHERE ArtistID = ? AND Status = 'PENDING' ORDER BY RequestAt DESC";

    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, artistID);
        try (ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                CommissionRequest req = new CommissionRequest();
                req.setID(rs.getInt("ID"));
                req.setClientID(rs.getInt("ClientID"));
                req.setArtistID(rs.getInt("ArtistID"));
                req.setShortDescription(rs.getString("ShortDescription"));
                req.setReferenceURL(rs.getString("ReferenceURL"));
                req.setProposedPrice(rs.getDouble("ProposedPrice"));

                Timestamp deadlineTS = rs.getTimestamp("ProposedDeadline");
                if (deadlineTS != null) {
                    req.setProposedDeadline(deadlineTS.toLocalDateTime());
                }

                req.setStatus(rs.getString("Status"));
                req.setArtistReply(rs.getString("ArtistReply"));

                Timestamp requestAtTS = rs.getTimestamp("RequestAt");
                if (requestAtTS != null) {
                    req.setRequestAt(requestAtTS.toLocalDateTime());
                }

                Timestamp respondedAtTS = rs.getTimestamp("RespondedAt");
                if (respondedAtTS != null) {
                    req.setRespondedAt(respondedAtTS.toLocalDateTime());
                }

                list.add(req);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }

    return list;
}	
   
   public List<CommissionRequest> getClientRequestsByClientID(int clientID) {
    List<CommissionRequest> list = new ArrayList<>();
    String sql = "SELECT * FROM CommissionRequest WHERE ClientID = ? ORDER BY RequestAt DESC";

    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, clientID);
        try (ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                CommissionRequest req = new CommissionRequest();
                req.setID(rs.getInt("ID"));
                req.setClientID(rs.getInt("ClientID"));
                req.setArtistID(rs.getInt("ArtistID"));
                req.setShortDescription(rs.getString("ShortDescription"));
                req.setReferenceURL(rs.getString("ReferenceURL"));
                req.setProposedPrice(rs.getDouble("ProposedPrice"));

                Timestamp deadlineTS = rs.getTimestamp("ProposedDeadline");
                if (deadlineTS != null) {
                    req.setProposedDeadline(deadlineTS.toLocalDateTime());
                }

                req.setStatus(rs.getString("Status"));
                req.setArtistReply(rs.getString("ArtistReply"));

                Timestamp requestAtTS = rs.getTimestamp("RequestAt");
                if (requestAtTS != null) {
                    req.setRequestAt(requestAtTS.toLocalDateTime());
                }

                Timestamp respondedAtTS = rs.getTimestamp("RespondedAt");
                if (respondedAtTS != null) {
                    req.setRespondedAt(respondedAtTS.toLocalDateTime());
                }

                list.add(req);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }

    return list;
}
   
public boolean createCommission(int requestID, String title, String description, double price, LocalDateTime deadline) throws SQLException {
    // kiểm tra request có được chấp nhận chưa
    String checkSql = "SELECT Status FROM CommissionRequest WHERE ID = ?";
    try (PreparedStatement checkStmt = connection.prepareStatement(checkSql)) {
        checkStmt.setInt(1, requestID);
        try (ResultSet rs = checkStmt.executeQuery()) {
            if (rs.next()) {
                String status = rs.getString("Status");
                if (!"ACCEPTED".equalsIgnoreCase(status)) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    // chèn commission mới
    String insertSql = "INSERT INTO Commission (RequestID, Title, Description, Price, Deadline) VALUES (?, ?, ?, ?, ?)";
    try (PreparedStatement stmt = connection.prepareStatement(insertSql)) {
        stmt.setInt(1, requestID);
        stmt.setString(2, title);
        stmt.setString(3, description);
        stmt.setDouble(4, price);
        stmt.setTimestamp(5, Timestamp.valueOf(deadline));
        return stmt.executeUpdate() > 0;
    }
}




}
