/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Transaction;

public class TransactionDAO extends DBContext {

    public List<Transaction> getTransactionsByUserId(int userId) {
        List<Transaction> transactions = new ArrayList<>();
        String sql = """
        SELECT ID, UserID, PaymentMethod, Amount, Currency, Status, Description, CreatedAt 
        FROM Transactions 
        WHERE UserID = ? 
        ORDER BY CreatedAt ASC 
    """;

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            ResultSet rs = st.executeQuery();

            while (rs.next()) {
                Transaction transaction = new Transaction(
                        rs.getInt("ID"),
                        rs.getInt("UserID"),
                        rs.getString("PaymentMethod"),
                        rs.getBigDecimal("Amount"),
                        rs.getString("Currency"),
                        rs.getString("Status"),
                        rs.getString("Description"),
                        rs.getTimestamp("CreatedAt")
                );
                transactions.add(transaction);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return transactions;
    }

    public void insertTransaction(int userId, BigDecimal amount, String status, String method, String currency, String description) {
        String sql = """
        INSERT INTO Transactions (UserID, PaymentMethod, Amount, Currency, Status, Description, CreatedAt)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    """;

        System.out.println("=== Inserting Transaction ===");
        System.out.println("UserID: " + userId);
        System.out.println("PaymentMethod: " + method);
        System.out.println("Amount: " + amount);
        System.out.println("Currency: " + currency);
        System.out.println("Status: " + status);
        System.out.println("Description: " + description);

        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setInt(1, userId);
            st.setString(2, method);
            st.setBigDecimal(3, amount);
            st.setString(4, currency);
            st.setString(5, status);
            st.setString(6, description);

            int rowsAffected = st.executeUpdate();
            System.out.println("Transaction inserted successfully, rows affected: " + rowsAffected);

        } catch (SQLException e) {
            System.err.println("SQL Error: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public boolean isTxnRefExists(String txnRef) {
        String sql = "SELECT COUNT(*) FROM Transactions WHERE Description LIKE ?";
        try (PreparedStatement st = connection.prepareStatement(sql)) {
            st.setString(1, "%txnRef: " + txnRef + "%");
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                return rs.getInt(1) > 0;
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
