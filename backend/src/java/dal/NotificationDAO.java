package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Notification;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/**
 *
 * @author nvg
 */
public class NotificationDAO extends DBContext{

    public boolean saveNotification(int userId, int postId, String type, String content) {
        String sql = "INSERT INTO Notifications (UserID, Type, Content, PostID) VALUES (?,?,?,?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, type);
            stmt.setString(3, content);
            stmt.setInt(4, postId);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } 
    }

    public boolean saveNotification(int userId, String type, String content) {
        String sql = "INSERT INTO Notifications (UserID, Type, Content) VALUES (?,?,?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, type);
            stmt.setString(3, content);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        } 
    }

    // get all notifications with userId
    public List<Notification> getNotifications(int userId) {
        List<Notification> notifications = new ArrayList<>();
        String sql = "SELECT ID, UserID, Type, Content, PostID, IsRead, CreatedAt FROM Notifications WHERE UserID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Notification notification = new Notification(
                        rs.getInt("ID"),
                        rs.getInt("UserID"),
                        rs.getString("Type"),
                        rs.getString("Content"),
                        rs.getObject("PostID") != null ? rs.getInt("PostID") : null,
                        rs.getBoolean("IsRead"),
                        rs.getTimestamp("CreatedAt").toLocalDateTime()
                    );
                    notifications.add(notification);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return notifications;
    }

    public boolean markAsRead(int ID, boolean isRead) {
        String sql = "UPDATE Notifications SET IsRead = ? WHERE ID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setBoolean(1, isRead);
            stmt.setInt(2, ID);
            int rows = stmt.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

}
