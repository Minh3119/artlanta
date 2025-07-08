/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import model.Live;

/**
 *
 * @author ADMIN
 */
public class LiveDAO extends DBContext {

    public List<Live> getAll() {
        List<Live> list = new ArrayList<>();
        try {
            PreparedStatement st = connection.prepareStatement("Select lp.ID,lp.UserID,u.Username,u.AvatarURL,lp.Title,lp.LiveView,lp.CreatedAt,lp.LiveStatus,lp.Visibility from LivePosts as lp join Users as u on lp.UserID=u.ID");
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                list.add(new Live(rs.getInt("ID"), rs.getInt("UserID"), rs.getString("Username"), rs.getString("AvatarURL"), rs.getString("Title"), rs.getInt("LiveView"), rs.getTimestamp("CreatedAt").toLocalDateTime(), rs.getString("LiveStatus"), rs.getString("Visibility")));
            }
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

}
