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
                list.add(new Music(userID, rs.getString("Playlist"), rs.getString("MediaURL")));

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
            st.setString(2, playlist.getMediaURL());
            st.executeUpdate();
            st.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void updatePlaylist(Music playlist) {

    }

    public void deletePlaylist(Music playlist) {

    }
}
