/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import model.ReportPost;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


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
	  public List<ReportPost> getReportedPosts() {
        List<ReportPost> list = new ArrayList<>();
        String sql = """
            SELECT PostID, COUNT(*) AS ReportCount
            FROM ReportPost
            GROUP BY PostID
        """;

        try (PreparedStatement ps = connection.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                int postId = rs.getInt("PostID");
                int count = rs.getInt("ReportCount");

                ReportPost rp = new ReportPost(0, postId, "Total: " + count, null, null);
                list.add(rp);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    // 2. Lấy danh sách lý do report của 1 post (danh sách từng dòng report thật)
    public List<ReportPost> getReportReasonsByPost(int postId) {
        List<ReportPost> list = new ArrayList<>();
        String sql = """
            SELECT * FROM ReportPost
            WHERE PostID = ?
        """;

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, postId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ReportPost rp = new ReportPost(
                        rs.getInt("ReportedID"),
                        rs.getInt("PostID"),
                        rs.getString("Reason"),
                        rs.getTimestamp("ReportAt").toLocalDateTime(),
                        rs.getString("Status")
                    );
                    list.add(rp);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    // 3. Lấy lý do report chiếm nhiều nhất của 1 post
    public String getTopReasonByPost(int postId) {
        String reason = null;
        String sql = """
            SELECT Reason
            FROM ReportPost
            WHERE PostID = ?
            GROUP BY Reason
            ORDER BY COUNT(*) DESC
            LIMIT 1
        """;

        try (PreparedStatement ps = connection.prepareStatement(sql)) {
            ps.setInt(1, postId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    reason = rs.getString("Reason");
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return reason;
    }


}
