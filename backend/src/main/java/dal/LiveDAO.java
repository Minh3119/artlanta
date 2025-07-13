/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
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
            PreparedStatement st = connection.prepareStatement("Select lp.ID,lp.UserID,u.Username,u.AvatarURL,lp.Title, lp.LiveID, lp.LiveView,lp.CreatedAt,lp.LiveStatus,lp.Visibility from LivePosts as lp join Users as u on lp.UserID=u.ID order by lp.CreatedAt DESC;");
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                list.add(new Live(rs.getInt("ID"), rs.getInt("UserID"), rs.getString("Username"), rs.getString("AvatarURL"), rs.getString("Title"), rs.getString("LiveID"), rs.getInt("LiveView"), rs.getTimestamp("CreatedAt").toLocalDateTime(), rs.getString("LiveStatus"), rs.getString("Visibility")));
            }
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    public Live getOne(int ID) {
        String sql = """
                   Select lp.ID,lp.UserID,u.Username,u.AvatarURL,lp.Title, lp.LiveID,
                        lp.LiveView,lp.CreatedAt,lp.LiveStatus,lp.Visibility 
                        from LivePosts as lp join Users as u on lp.UserID=u.ID
                        where lp.ID=?;
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, ID);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                return (new Live(rs.getInt("ID"), rs.getInt("UserID"), rs.getString("Username"), rs.getString("AvatarURL"), rs.getString("Title"), rs.getString("LiveID"), rs.getInt("LiveView"), rs.getTimestamp("CreatedAt").toLocalDateTime(), rs.getString("LiveStatus"), rs.getString("Visibility")));
            }
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new Live();
    }

    public int insertLive(int userID, String title, String liveID, String visibility) {
        int ID = 0;
        try {
            String sql = """
                       insert into LivePosts(UserID,Title,LiveID,LiveView,LiveStatus,Visibility) 
                       values(?,?,?,0,'Live',?);
                       """;
            PreparedStatement st = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            st.setInt(1, userID);
            st.setString(2, title);
            st.setString(3, liveID);
            st.setString(4, visibility);
            st.executeUpdate();
            ResultSet rs = st.getGeneratedKeys();
            rs.next();
            ID = rs.getInt(1);

            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ID;
    }
    public void updateView(int ID, int View){
        String sql="""
                   update LivePosts
                   set LiveView= ?
                   where ID=?;
                   """;
        try{
            PreparedStatement st= connection.prepareStatement(sql);
            st.setInt(1, View);
            st.setInt(2, ID);
            st.executeUpdate();
            
            st.close();
            
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }
    public void endLive(int ID, int View){
        String sql="""
                   update LivePosts
                   set LiveView= ?, LiveStatus='Post'
                   where ID=?;
                   """;
        try{
            PreparedStatement st= connection.prepareStatement(sql);
            st.setInt(1, View);
            st.setInt(2, ID);
            st.executeUpdate();
            
            st.close();
            
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

}
