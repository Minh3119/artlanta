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
        System.out.println("Attempting to save notification with postId");
        System.out.println("userId: " + userId + ", postId: " + postId + ", type: " + type);
        
        String sql = "INSERT INTO Notifications (UserID, Type, Content, PostID) VALUES (?,?,?,?)";
        System.out.println("Executing SQL: " + sql);
        System.out.println("Parameters: [" + userId + ", " + type + ", " + content + ", " + postId + "]");
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, type);
            stmt.setString(3, content);
            stmt.setInt(4, postId);
            int rows = stmt.executeUpdate();
            System.out.println("Rows affected: " + rows);
            return rows > 0;
        } catch (SQLException e) {
            System.err.println("Error saving notification: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
            e.printStackTrace();
            return false;
        } 
    }

    public boolean saveNotification(int userId, String type, String content) {
        System.out.println("Attempting to save notification without postId");
        System.out.println("userId: " + userId + ", type: " + type);
        
        String sql = "INSERT INTO Notifications (UserID, Type, Content) VALUES (?,?,?)";
        System.out.println("Executing SQL: " + sql);
        System.out.println("Parameters: [" + userId + ", " + type + ", " + content + "]");
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, userId);
            stmt.setString(2, type);
            stmt.setString(3, content);
            int rows = stmt.executeUpdate();
            System.out.println("Rows affected: " + rows);
            return rows > 0;
        } catch (SQLException e) {
            System.err.println("Error saving notification: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
            e.printStackTrace();
            return false;
        } 
    }

    // get all notifications with userId
    public List<Notification> getNotifications(int userId) {
        System.out.println("Fetching notifications for userId: " + userId);
        
        List<Notification> notifications = new ArrayList<>();
        String sql = "SELECT ID, UserID, Type, Content, PostID, IsRead, CreatedAt FROM Notifications WHERE UserID = ?";
        System.out.println("Executing SQL: " + sql);
        System.out.println("Parameters: [" + userId + "]");
        
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
                    System.out.println("Found notification: ID=" + notification.getID() + 
                                     ", type=" + notification.getType() + 
                                     ", content=" + notification.getContent());
                }
            }
            System.out.println("Retrieved " + notifications.size() + " notifications");
            return notifications;
        } catch (SQLException e) {
            System.err.println("Error fetching notifications: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
            e.printStackTrace();
            return notifications;
        }
    }

    public boolean markAsRead(int ID, boolean isRead) {
        System.out.println("Marking notification " + ID + " as " + (isRead ? "read" : "unread"));
        
        String sql = "UPDATE Notifications SET IsRead = ? WHERE ID = ?";
        System.out.println("Executing SQL: " + sql);
        System.out.println("Parameters: [" + isRead + ", " + ID + "]");
        
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setBoolean(1, isRead);
            stmt.setInt(2, ID);
            int rows = stmt.executeUpdate();
            System.out.println("Rows affected: " + rows);
            return rows > 0;
        } catch (SQLException e) {
            System.err.println("Error marking notification as read: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
            e.printStackTrace();
            return false;
        }
    }

}
