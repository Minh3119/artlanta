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
						rs.getTimestamp("CreatedAt").toLocalDateTime(),
						rs.getString("DisplayName"),
						rs.getString("Bio"),
						rs.getString("AvatarURL"),
						rs.getString("Status"),
						rs.getString("Role"));

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
						rs.getTimestamp("CreatedAt").toLocalDateTime(),
						rs.getString("DisplayName"),
						rs.getString("Bio"),
						rs.getString("AvatarURL"),
						rs.getString("Status"),
						rs.getString("Role"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return u;
	}

}
