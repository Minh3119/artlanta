package dal;

import model.CommissionHistory;
import java.sql.*;
import java.util.*;

public class CommissionHistoryDAO extends DBContext {
    public List<CommissionHistory> getHistoryByCommissionId(int commissionId) throws SQLException {
        List<CommissionHistory> historyList = new ArrayList<>();
        String sql = "SELECT * FROM CommissionHistory WHERE CommissionID = ? ORDER BY ChangedAt DESC";
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, commissionId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CommissionHistory history = new CommissionHistory(
                        rs.getInt("ID"),
                        rs.getInt("CommissionID"),
                        rs.getString("ChangedField"),
                        rs.getString("OldValue"),
                        rs.getString("NewValue"),
                        rs.getInt("ChangedBy"),
                        rs.getTimestamp("ChangedAt").toLocalDateTime()
                    );
                    historyList.add(history);
                }
            }
        }
        return historyList;
    }
} 