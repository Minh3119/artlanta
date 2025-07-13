/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Post;
/**
 *
 * @author Asus
 */
public class SaveDAO extends DBContext {
	public boolean insertSavedPost(int userId, int postId) {
    String sql = "INSERT INTO SavedPost (UserID, PostID) VALUES (?, ?)";
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, userId);
        stmt.setInt(2, postId);
        int rows = stmt.executeUpdate();
        return rows > 0;
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return false;
}
	public List<Post> getAllSavePosts(int limit, int offset, int userID) {
		List<Post> posts = new ArrayList<>();
		try {
			String sql = "SELECT p.ID,p.UserID,p.Content,p.isDraft, p.Visibility,p.CreatedAt,p.UpdatedAt,p.IsFlagged FROM Posts p JOIN SavedPost sp on p.ID=sp.PostID Join Users u on sp.UserID=u.ID WHERE sp.UserID=? LIMIT ?,?;";
			PreparedStatement st = connection.prepareStatement(sql);
			st.setInt(2, limit);
			st.setInt(3, offset);
			st.setInt(1, userID);
			ResultSet rs = st.executeQuery();
			
			while (rs.next()) {
				Post post = new Post(
						rs.getInt("ID"),
						rs.getInt("UserID"),
						rs.getString("Content"),
						rs.getBoolean("IsDraft"),
						rs.getString("Visibility"),
						rs.getTimestamp("CreatedAt").toLocalDateTime(),
						rs.getTimestamp("UpdatedAt") != null ? rs.getTimestamp("UpdatedAt").toLocalDateTime() : null,
						rs.getBoolean("IsFlagged")
				);
				posts.add(post);
			}
			rs.close();
			st.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return posts;
	}
	
	// Xóa post đã save
public boolean unsavePost(int userId, int postId) {
    String sql = "DELETE FROM SavedPost WHERE UserID = ? AND PostID = ?";
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, userId);
        stmt.setInt(2, postId);
        int rows = stmt.executeUpdate();
        return rows > 0;
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return false;
}

// Kiểm tra post đã được save chưa
public boolean isSaved(int userId, int postId) {
    String sql = "SELECT * FROM SavedPost WHERE UserID = ? AND PostID = ?";
    try (PreparedStatement stmt = connection.prepareStatement(sql)) {
        stmt.setInt(1, userId);
        stmt.setInt(2, postId);
        ResultSet rs = stmt.executeQuery();
        boolean exists = rs.next();
        rs.close();
        return exists;
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return false;
}

// Toggle: nếu đã save thì xóa, nếu chưa thì thêm
public boolean toggleSavePost(int userId, int postId) {
    if (isSaved(userId, postId)) {
        return unsavePost(userId, postId);
    } else {
        return insertSavedPost(userId, postId);
    }
}

}
