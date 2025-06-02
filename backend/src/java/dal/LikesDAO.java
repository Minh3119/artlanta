package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;

public class LikesDAO extends DBContext {

	public boolean isLiked(int userId, int postID) {
		if (userId <= 0) {
			return false;
		}

		String query = "SELECT * FROM Likes WHERE UserID = ? AND PostID = ?";
		try (PreparedStatement ps = connection.prepareStatement(query)) {
			ps.setInt(1, userId);
			ps.setInt(2, postID);
			ResultSet rs = ps.executeQuery();
			return rs.next();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;	
	}

	public boolean like(int userId, int postID) {
		if (userId <= 0) {
			return false;
		}
		if (isLiked(userId, postID)) {
			return true;
		}

		String query = "INSERT INTO Likes (UserID, PostID, LikedAt) VALUES (?, ?, CURRENT_TIMESTAMP)";
		try (PreparedStatement ps = connection.prepareStatement(query)) {
			ps.setInt(1, userId);
			ps.setInt(2, postID);
			int rowsAffected = ps.executeUpdate();
			return rowsAffected > 0;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean unlike(int userId, int postID) {
		if (userId <= 0) { // Invalid userID
			return false;
		}
		if (!isLiked(userId, postID)) { // Chưa thích
			return true;
		}

		String query = "DELETE FROM Likes WHERE UserID = ? AND PostID = ?";
		try (PreparedStatement ps = connection.prepareStatement(query)) {
			ps.setInt(1, userId);
			ps.setInt(2, postID);
			int rowsAffected = ps.executeUpdate();
			return rowsAffected > 0;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}

	public boolean toggleLike(int userId, int postID) {
		if (userId <= 0) {
			return false;
		}

		if (isLiked(userId, postID)) {
			return unlike(userId, postID);
		} else {
			return like(userId, postID);
		}
	}

}
