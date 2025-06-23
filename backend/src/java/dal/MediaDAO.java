package dal;

import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Media;

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
                        rs.getString("Description"));
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
                       select m.ID, pm.PostID,m.URL from postmedia as pm join media as m on pm.MediaID=m.ID
                       where pm.PostID=?;
                       """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, postID);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                list.add(new Media(rs.getInt("ID"), rs.getString("URL"), ""));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public Media getMediaByID(int ID) {
        Media m = new Media();
        try {
            String sql = """
                       select * from Media
                       where ID=?;
                       """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, ID);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                m = new Media(ID, rs.getString("URL"), "");
            }
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return m;
    }

    public void deleteMediaByID(int ID) {
        try {
            PreparedStatement pstMedia = connection.prepareStatement("""
                                                                     delete FROM Media WHERE ID=?;
                                                                    """);
            pstMedia.setInt(1, ID);
            pstMedia.executeUpdate();
            pstMedia.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void deletePostMediaByID(int ID) {
        try {
            PreparedStatement pstMedia = connection.prepareStatement("""
                                                                     delete FROM PostMedia WHERE MediaID=?;
                                                                    """);
            pstMedia.setInt(1, ID);
            pstMedia.executeUpdate();
            pstMedia.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    //deleteMediaByPostID
    //using Transactions -> reduce time in server-side
    //select all Media according to postID -> media list
    //delete data according to the media list
    //delete the post accoriding to postID
    //commit
    public void updateMediaByPostID(int postID, List<Media> list) throws SQLException {
        PreparedStatement pstMedia = null, pstPostMedia = null;

        try {
            connection.setAutoCommit(false);

            //re-insert
            pstMedia = connection.prepareStatement("""
                                                 insert into Media(URL)
                                                 values(?);
                                                 """,
                    Statement.RETURN_GENERATED_KEYS);
            pstPostMedia = connection.prepareStatement("""
                                                      insert into PostMedia(PostID,MediaID)
                                                      values(?,?);
                                                      """);
            for (Media m : list) {
                pstMedia.setString(1, m.getURL());
                pstMedia.executeUpdate();
                ResultSet rsMedia = pstMedia.getGeneratedKeys();
                rsMedia.next();
                int mediaID = rsMedia.getInt(1);

                pstPostMedia.setInt(1, postID);
                pstPostMedia.setInt(2, mediaID);
                pstPostMedia.executeUpdate();
            }

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

    public String getMediaByPostID(int ID) {
        String result = "khongco";
        try {
            String sql = """
                       select pm.PostID, m.ID, m.URL 
                       from PostMedia as pm join Media as m on pm.MediaID=m.ID
                       where pm.PostID=?
                       LIMIT 1;
                       """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, ID);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                result= rs.getString("URL");
            }
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }
}
