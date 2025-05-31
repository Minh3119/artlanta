/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;
import model.Media;
import model.PortfolioMedia;

/**
 *
 * @author ADMIN
 */
public class MediaDAO extends DBContext {
    //especially for get the autogenID
    public int createMediaReturnID(Media media) {
        int mediaID = 0;
        try {
            String sql = """
                    insert into Media(URL)
                    values(?)
                   """;
            PreparedStatement st = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            st.setString(1, media.getURL());
            st.executeUpdate();

            ResultSet rs = st.getGeneratedKeys();

            if (rs.next()) {
                mediaID = rs.getInt(1);
            }
            st.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mediaID;
    }

    public void createPostMedia(int postID, int mediaID) {
        try {
            String sql = """
                       insert into PostMedia(PostID,MediaID)
                       values(?,?)
                       """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, postID);
            st.setInt(2, mediaID);
            st.executeUpdate();
            st.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<Media> getPortfolioMedia(int artistId) {
        List<Media> mediaList = new ArrayList<>();
        try {
            String sql = """
                    SELECT m.* 
                    FROM Media m 
                    JOIN PortfolioMedia pm ON m.ID = pm.MediaID 
                    WHERE pm.ArtistID = ?
                    """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, artistId);
            ResultSet rs = st.executeQuery();
            
            while (rs.next()) {
                Media media = new Media(
                    rs.getInt("ID"),
                    rs.getString("URL"),
                    rs.getString("Description"),
                    rs.getTimestamp("CreatedAt")
                );
                mediaList.add(media);
            }
            
            rs.close();
            st.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mediaList;
    }
}
