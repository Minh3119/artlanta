/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import model.CommissionRequest;

/**
 *
 * @author Asus
 */
public class CommissionDAO extends DBContext {

    // Kiểm tra nếu đã tồn tại request đang chờ duyệt từ client đến artist
    public boolean hasPendingRequest(int clientID, int artistID) throws SQLException {
        String sql = "SELECT COUNT(*) FROM CommissionRequest WHERE ClientID = ? AND ArtistID = ? AND Status = 'PENDING'";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, clientID);
            stmt.setInt(2, artistID);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
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
            stmt.setBigDecimal(5, req.getProposedPrice());
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
}
