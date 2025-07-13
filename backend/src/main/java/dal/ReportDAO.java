/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;


/**
 *
 * @author Asus
 */
public class ReportDAO extends DBContext{

	public boolean insertReport(int reporterId, int postId, String reason) {
	String sql = "INSERT INTO ReportPost (ReporterID, PostID, Reason) " +
	             "VALUES (?, ?, ?) " +
	             "ON DUPLICATE KEY UPDATE Reason = VALUES(Reason), ReportAt = NOW(), Status = 'PENDING'";
	try (PreparedStatement stmt = connection.prepareStatement(sql)) {
		stmt.setInt(1, reporterId);
		stmt.setInt(2, postId);
		stmt.setString(3, reason);
		int rows = stmt.executeUpdate();
		return rows > 0;
	} catch (SQLException e) {
		e.printStackTrace();
	}
	return false;
}



}
