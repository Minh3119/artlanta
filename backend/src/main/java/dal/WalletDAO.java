/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author anhkt
 */
public class WalletDAO extends DBContext {

    public BigDecimal getBalance(int userID) {
        String sql = "SELECT Balance FROM Wallets WHERE UserID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                return rs.getBigDecimal("Balance");
            }
            rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return BigDecimal.ZERO;
    }

    public boolean checkWalletExists(int userID) {
        String sql = "SELECT 1 FROM Wallets WHERE UserID = ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();
            return rs.next(); // true nếu có ví
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deductFromWallet(int userId, BigDecimal amount) {
        String sql = "UPDATE Wallets SET Balance = Balance - ? WHERE UserID = ? AND Balance >= ?";

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setBigDecimal(1, amount);
            ps.setInt(2, userId);
            ps.setBigDecimal(3, amount);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    public void addBalance(int userID, BigDecimal amount) {
        // Kiểm tra wallet có tồn tại không
        String checkSql = "SELECT UserID FROM Wallets WHERE UserID = ?";
        try (PreparedStatement checkSt = connection.prepareStatement(checkSql)) {
            checkSt.setInt(1, userID);
            ResultSet rs = checkSt.executeQuery();

            if (!rs.next()) {
                // Chưa có wallet → tạo mới
                String insertSql = "INSERT INTO Wallets (UserID, Balance, Currency) VALUES (?, ?, 'VND')";
                try (PreparedStatement insertSt = connection.prepareStatement(insertSql)) {
                    insertSt.setInt(1, userID);
                    insertSt.setBigDecimal(2, amount);
                    insertSt.executeUpdate();
                    System.out.println("Created new wallet for user " + userID + " with balance " + amount);
                    return;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Đã có wallet → cập nhật balance
        String updateSql = "UPDATE Wallets SET Balance = Balance + ?, UpdatedAt = CURRENT_TIMESTAMP WHERE UserID = ?";
        try (PreparedStatement updateSt = connection.prepareStatement(updateSql)) {
            updateSt.setBigDecimal(1, amount);
            updateSt.setInt(2, userID);
            int rowsAffected = updateSt.executeUpdate();
            System.out.println("Updated wallet for user " + userID + ", rows affected: " + rowsAffected);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public BigDecimal getTotalBalance() throws SQLException {
        String sql = "SELECT SUM(Balance) FROM Wallets";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
        }
    }

    public BigDecimal getTotalTransactionAmount() throws SQLException {
        String sql = "SELECT SUM(Amount) FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản'";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
        }
    }

    public int getTotalTransactionCount() throws SQLException {
        String sql = "SELECT COUNT(*) FROM Transactions";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public int getSuccessfulTransactionCount() throws SQLException {
        String sql = "SELECT COUNT(*) FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản'";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    public List<String> getTopPaymentMethods(int limit) throws SQLException {
        String sql = "SELECT PaymentMethod, COUNT(*) as count FROM Transactions GROUP BY PaymentMethod ORDER BY count DESC LIMIT ?";
        List<String> methods = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    methods.add(rs.getString("PaymentMethod"));
                }
            }
        }
        return methods;
    }

    public List<Map<String, Object>> getRecentTransactions(int limit) throws SQLException {
        String sql = "SELECT t.ID, t.UserID, u.Username, t.Amount, t.Status, t.PaymentMethod, t.CreatedAt FROM Transactions t JOIN Users u ON t.UserID = u.ID ORDER BY t.CreatedAt DESC LIMIT ?";
        List<Map<String, Object>> list = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> record = new HashMap<>();
                    record.put("TransactionID", rs.getInt("ID"));
                    record.put("UserID", rs.getInt("UserID"));
                    record.put("Username", rs.getString("Username"));
                    record.put("Amount", rs.getBigDecimal("Amount"));
                    record.put("Status", rs.getString("Status"));
                    record.put("Method", rs.getString("PaymentMethod"));
                    record.put("CreatedAt", rs.getTimestamp("CreatedAt"));
                    list.add(record);
                }
            }
        }
        return list;
    }

    public List<Map<String, Object>> getTopUsersByBalance(int limit) throws SQLException {
        String sql = "SELECT w.UserID, u.Username, w.Balance FROM Wallets w JOIN Users u ON w.UserID = u.ID ORDER BY w.Balance DESC LIMIT ?";
        List<Map<String, Object>> list = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> record = new HashMap<>();
                    record.put("UserID", rs.getInt("UserID"));
                    record.put("Username", rs.getString("Username"));
                    record.put("Balance", rs.getBigDecimal("Balance"));
                    list.add(record);
                }
            }
        }
        return list;
    }

    // 5. Tổng doanh thu theo từng tháng (dùng để vẽ chart)
    public Map<String, BigDecimal> getMonthlyRevenue() throws SQLException {
        String sql = "SELECT DATE_FORMAT(CreatedAt, '%Y-%m') as Month, SUM(Amount) as Revenue "
                + "FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản' GROUP BY Month ORDER BY Month";
        Map<String, BigDecimal> revenue = new LinkedHashMap<>();
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                revenue.put(rs.getString("Month"), rs.getBigDecimal("Revenue"));
            }
        }
        return revenue;
    }

    public Map<String, BigDecimal> getYearlyRevenue() throws SQLException {
        String sql = "SELECT DATE_FORMAT(CreatedAt, '%Y-%m') as Year, SUM(Amount) as Revenue "
                + "FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản' GROUP BY Year ORDER BY Year";
        Map<String, BigDecimal> revenue = new LinkedHashMap<>();
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                revenue.put(rs.getString("Month"), rs.getBigDecimal("Revenue"));
            }
        }
        return revenue;
    }

    // 3. Top 5 người dùng chi tiêu nhiều nhất
    public List<Map<String, Object>> getTopSpenders(int limit) throws SQLException {
        String sql = "SELECT u.ID, u.Username, SUM(t.Amount) as TotalSpent "
                + "FROM Transactions t JOIN Users u ON t.UserID = u.ID "
                + "WHERE t.Status = 'Nạp tiền vào tài khoản' GROUP BY u.ID, u.Username "
                + "ORDER BY TotalSpent DESC LIMIT ?";
        List<Map<String, Object>> result = new ArrayList<>();
        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, limit);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("UserID", rs.getInt("ID"));
                    row.put("Username", rs.getString("Username"));
                    row.put("TotalSpent", rs.getBigDecimal("TotalSpent"));
                    result.add(row);
                }
            }
        }
        return result;
    }

    public BigDecimal getARPU() throws SQLException {
        String sql = "SELECT SUM(Amount) / COUNT(DISTINCT UserID) FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản'";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
        }
    }

    public int getUsersWithPayment() throws SQLException {
        String sql = "SELECT COUNT(DISTINCT UserID) FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản'";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt(1) : 0;
        }
    }

    // 1. Tỷ lệ chuyển đổi từ người dùng sang trả phí
    public double getUserConversionRate() throws SQLException {
        String sql = "SELECT (SELECT COUNT(DISTINCT UserID) FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản') * 1.0 / (SELECT COUNT(*) FROM Users)";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getDouble(1) : 0.0;
        }
    }

// 2. LTV (tổng số tiền trung bình của 1 người trả phí)
    public BigDecimal getLTV() throws SQLException {
        String sql = "SELECT SUM(Amount) / COUNT(DISTINCT UserID) FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản'";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getBigDecimal(1) : BigDecimal.ZERO;
        }
    }

// 3. Phân phối giá trị giao dịch
    public Map<String, Integer> getTransactionValueDistribution() throws SQLException {
        String sql = "SELECT "
                + "SUM(CASE WHEN Amount < 50000 THEN 1 ELSE 0 END) as Under50k, "
                + "SUM(CASE WHEN Amount BETWEEN 50000 AND 200000 THEN 1 ELSE 0 END) as From50kTo200k, "
                + "SUM(CASE WHEN Amount > 200000 THEN 1 ELSE 0 END) as Over200k "
                + "FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản'";
        Map<String, Integer> map = new HashMap<>();
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                map.put("Under50k", rs.getInt("Under50k"));
                map.put("From50kTo200k", rs.getInt("From50kTo200k"));
                map.put("Over200k", rs.getInt("Over200k"));
            }
        }
        return map;
    }

// 5. Doanh thu theo tuần
    public Map<String, BigDecimal> getWeeklyRevenue() throws SQLException {
        String sql = "SELECT DATE_FORMAT(CreatedAt, '%Y-%u') as Week, SUM(Amount) as Revenue "
                + "FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản' GROUP BY Week ORDER BY Week";
        Map<String, BigDecimal> data = new LinkedHashMap<>();
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                data.put(rs.getString("Week"), rs.getBigDecimal("Revenue"));
            }
        }
        return data;
    }

    public Map<String, Object> getTopUserByTotalAmount() throws SQLException {
        String sql = "SELECT u.ID as UserID, u.Username, w.Balance "
                + "FROM Users u JOIN Wallets w ON u.ID = w.UserID "
                + "ORDER BY w.Balance DESC LIMIT 1";

        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                Map<String, Object> result = new HashMap<>();
                result.put("UserID", rs.getInt("UserID"));
                result.put("Username", rs.getString("Username"));
                result.put("Balance", rs.getBigDecimal("Balance"));
                return result;
            }
        }
        return Collections.emptyMap();
    }

    public String getTopPaymentMethod() throws SQLException {
        String sql = "SELECT PaymentMethod, COUNT(*) as Total "
                + "FROM Transactions GROUP BY PaymentMethod ORDER BY Total DESC LIMIT 1";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getString("PaymentMethod") : null;
        }
    }

    public String getTopTransactionMonth() throws SQLException {
        String sql = "SELECT DATE_FORMAT(CreatedAt, '%Y-%m') as Month, SUM(Amount) as Total "
                + "FROM Transactions WHERE Status = 'Nạp tiền vào tài khoản' "
                + "GROUP BY Month ORDER BY Total DESC LIMIT 1";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getString("Month") : null;
        }
    }

    public Map<String, Object> getTopTransaction() throws SQLException {
        String sql = "SELECT t.ID as TransactionID, u.Username, t.UserID, t.Amount, t.CreatedAt, t.PaymentMethod "
                + "FROM Transactions t JOIN Users u ON t.UserID = u.ID "
                + "WHERE t.Status = 'Nạp tiền vào tài khoản' ORDER BY t.Amount DESC LIMIT 1";
        try (PreparedStatement ps = connection.prepareStatement(sql); ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                Map<String, Object> result = new HashMap<>();
                result.put("TransactionID", rs.getInt("TransactionID"));
                result.put("UserID", rs.getInt("UserID"));
                result.put("Username", rs.getString("Username"));
                result.put("Amount", rs.getBigDecimal("Amount"));
                result.put("Method", rs.getString("PaymentMethod"));
                result.put("CreatedAt", rs.getTimestamp("CreatedAt"));
                return result;
            }
        }
        return Collections.emptyMap();
    }

}
