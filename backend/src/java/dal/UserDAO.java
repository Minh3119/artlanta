package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.User;

public class UserDAO extends DBContext {

	public List<User> getAll() {
		List<User> list = new ArrayList<>();
		String sql = "SELECT * FROM Users";
		try {
			PreparedStatement stmt = connection.prepareStatement(sql);
			ResultSet rs = stmt.executeQuery();
			while (rs.next()) {
				User users = new User(
						rs.getInt("ID"),
						rs.getString("Username"),
						rs.getString("Email"),
						rs.getString("PasswordHash"),
						rs.getString("FullName"),
						rs.getString("Bio"),
						rs.getString("AvatarURL"),
						rs.getBoolean("Gender"),
//						rs.getTimestamp("DOB").toLocalDateTime(),
						rs.getString("Location"),
						rs.getString("Role"),
						rs.getString("Status"),
						rs.getString("Language"),
						rs.getTimestamp("CreatedAt").toLocalDateTime(),
						rs.getTimestamp("LastLogin") != null ? rs.getTimestamp("LastLogin").toLocalDateTime() : null,
						rs.getBoolean("IsPrivate"));

				list.add(users);
			}
			rs.close();
			stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}

	public User getOne(int userID) {
		User u = null;
		try {
			String sql = "SELECT * FROM Users WHERE `Users`.ID = ?";
			PreparedStatement st = connection.prepareStatement(sql);
			st.setInt(1, userID);
			ResultSet rs = st.executeQuery();
			if (rs.next()) {
				u = new User(
						rs.getInt("ID"),
						rs.getString("Username"),
						rs.getString("Email"),
						rs.getString("PasswordHash"),
						rs.getString("FullName"),
						rs.getString("Bio"),
						rs.getString("AvatarURL"),
						rs.getBoolean("Gender"),
//						rs.getTimestamp("DOB").toLocalDateTime(),
						rs.getString("Location"),
						rs.getString("Role"),
						rs.getString("Status"),
						rs.getString("Language"),
						rs.getTimestamp("CreatedAt").toLocalDateTime(),
						rs.getTimestamp("LastLogin") != null ? rs.getTimestamp("LastLogin").toLocalDateTime() : null,
						rs.getBoolean("IsPrivate"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return u;
	}

	public List<User> getByRole(String role) {
		List<User> users = new ArrayList<>();
		String sql = "SELECT * FROM Users WHERE Role = ? AND Status = 'ACTIVE'";
		try {
			PreparedStatement st = connection.prepareStatement(sql);
			st.setString(1, role);
			ResultSet rs = st.executeQuery();
			
			while (rs.next()) {
				User user = new User(
					rs.getInt("ID"),
					rs.getString("Username"),
					rs.getString("Email"),
					rs.getString("PasswordHash"),
					rs.getString("FullName"), 
					rs.getString("Bio"),
					rs.getString("AvatarURL"),
					rs.getBoolean("Gender"),
					rs.getString("Location"),
					rs.getString("Role"),
					rs.getString("Status"),
					rs.getString("Language"),
					rs.getTimestamp("CreatedAt").toLocalDateTime(),
					rs.getTimestamp("LastLogin") != null ? rs.getTimestamp("LastLogin").toLocalDateTime() : null,
					rs.getBoolean("IsPrivate")
				);
				users.add(user);
			}
		} catch (SQLException e) {
			System.out.println("Error getting users by role: " + e.getMessage());
		}
		return users;
	}

}
