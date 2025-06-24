/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.ResultSet;

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
}
