/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import model.Media;
import model.PortfolioMedia;

/**
 *
 * @author ADMIN
 */
public class MediaDAO extends DBContext {

    // especially for get the autogenID
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
                        rs.getTimestamp("CreatedAt"));
                mediaList.add(media);
            }

            rs.close();
            st.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mediaList;
    }

    public List<Media> getPostMediaByID(int postID) {
        List<Media> list = new ArrayList<>();
        try {
            String sql = """
                       select pm.PostID,m.URL from postmedia as pm join media as m on pm.MediaID=m.ID
                       where pm.PostID=?;
                       """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, postID);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                list.add(new Media(0, rs.getString("URL"), "", null));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    //deleteMediaByPostID
    //using Transactions -> reduce time in server-side
    //select all Media according to postID -> media list
    //delete data according to the media list
    //delete the post accoriding to postID
    //commit
    public void deleteMediaByPostID(int postID) throws SQLException {
        PreparedStatement pstMedia = null,pstPost=null;

        try {
            connection.setAutoCommit(false);
            pstMedia = connection.prepareStatement("""
                                                 select m.ID,m.URL from Media as m join PostMedia as pm on m.ID=pm.MediaID
                                                   where pm.postId=?
                                                 """);

            pstMedia.setInt(1, postID);
            ResultSet rs = pstMedia.executeQuery();
            List<Integer> mediaID = new ArrayList<>();
            while (rs.next()) {
                mediaID.add(rs.getInt("ID"));
            }

            if (!mediaID.isEmpty()) {
                pstMedia = connection.prepareStatement("DELETE FROM Media WHERE ID IN ("
                        + mediaID.stream().map(id -> "?").collect(Collectors.joining(",")) + ")");
                for (int i = 0; i < mediaID.size(); i++) {
                    pstMedia.setInt(i + 1, mediaID.get(i));
                }
                pstMedia.executeUpdate();
            }
            
            pstPost = connection.prepareStatement("""
                                                 delete from Posts where ID=?
                                                 """);
            
            pstPost.setInt(1,postID);
            pstPost.executeUpdate();
            
            connection.commit();
        } catch (SQLException e) {
            if (connection != null) {
                connection.rollback();
            }

            e.printStackTrace();
        } finally {
            try {
                if (pstMedia != null) {
                    pstMedia.close();
                }
                if (connection != null) {
                    connection.setAutoCommit(true);
                    connection.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }
    }
}
