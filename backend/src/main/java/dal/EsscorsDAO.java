/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 *
 * @author anhkt
 */
public class EsscorsDAO extends DBContext{
    public BigDecimal getTotalSpentByUser(int userId) {
    String sql = "SELECT SUM(Amount) AS Total FROM Escrows WHERE FromUserID = ? AND Status = 'PENDING'";
    try (PreparedStatement ps = connection.prepareStatement(sql)) {
        ps.setInt(1, userId);
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                BigDecimal total = rs.getBigDecimal("Total");
                return total != null ? total : BigDecimal.ZERO;
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return BigDecimal.ZERO;
}
}
