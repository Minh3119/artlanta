package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.Music;

public class MusicDAO extends DBContext {

    public List<Music> getPlaylistByUserID(int userID) {
        List<Music> list = new ArrayList<>();
        try {
            String sql = "SELECT * FROM MusicMedia where UserID=? ";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();

            while (rs.next()) {
                list.add(new Music(rs.getInt("ID"), userID, rs.getString("Playlist"), rs.getString("MediaURL")));

            }
            rs.close();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    public void insertPlaylist(Music playlist) {
        try {
            String sql = "insert into MusicMedia(UserID, Playlist, MediaURL) values(?,?,?);";
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, playlist.getUserID());
            st.setString(2, playlist.getPlaylist());
            st.setString(3, playlist.getMediaURL());
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();

        }
    }

    public void updatePlaylist(Music playlist) {
        try {
            String sql = """
                         update MusicMedia
                         set Playlist=?,MediaURL=?
                         where ID=?
                         """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, playlist.getPlaylist());
            st.setString(2, playlist.getMediaURL());
            st.setInt(3, playlist.getID());
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void deletePlaylist(int ID) {
        try {
            String sql = """
                         delete from MusicMedia
                         where ID=?
                         """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, ID);
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void insertPlayTime(int userID, int time) throws SQLException {
        PreparedStatement timeSelect = null, timeUpdate = null, timeInsert = null;
        int prevTime = 0;
        try {
            connection.setAutoCommit(false);

            timeSelect = connection.prepareStatement("""
                                                 select UserID, PlayTime from MusicPlayTime
                                                 where UserID=?
                                                 """);
            timeInsert = connection.prepareStatement("""
                                                      insert into MusicPlayTime(UserID,PlayTime)
                                                      values(?,?);
                                                      """);
            timeUpdate = connection.prepareStatement("""
                                                      update MusicPlayTime
                                                      set PlayTime=?
                                                      where UserID=?
                                                      """);

            timeSelect.setInt(1, userID);

            timeInsert.setInt(1, userID);
            timeInsert.setInt(2, time);

            ResultSet rs = timeSelect.executeQuery();
            if (rs.next()) {
                prevTime = rs.getInt("PlayTime");

                timeUpdate.setInt(1, prevTime + time);
                timeUpdate.setInt(2, userID);
                timeUpdate.executeUpdate();

            } else {
                timeInsert.setInt(1, userID);
                timeInsert.setInt(2, time);
                timeInsert.executeUpdate();
            }

            connection.commit();
        } catch (SQLException e) {
            if (connection != null) {
                connection.rollback();
            }
            e.printStackTrace();
        } finally {
            if (timeSelect != null) {
                timeSelect.close();
            }
            if (timeInsert != null) {
                timeInsert.close();
            }
            if (timeUpdate != null) {
                timeUpdate.close();
            }
            if (connection != null) {
                connection.setAutoCommit(true);
                connection.close();
            }
        }
    }

    public void deletePlayTime(int userID, int time) {

    }

    public int viewPlayTime(int userID) {
        return 0;
    }
}
