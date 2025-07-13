package model;
import java.sql.Timestamp;

public class UserHistory {

    int id;
    int userId;
    int postId;
    int artistId;
    Timestamp viewedAt;

    public UserHistory() {
    }

    public UserHistory(int id, int userId, int postId, int artistId, Timestamp viewedAt) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.artistId = artistId;
        this.viewedAt = viewedAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getPostId() {
        return postId;
    }

    public void setPostId(int postId) {
        this.postId = postId;
    }

    public int getArtistId() {
        return artistId;
    }

    public void setArtistId(int artistId) {
        this.artistId = artistId;
    }

    public Timestamp getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(Timestamp viewedAt) {
        this.viewedAt = viewedAt;
    }
}
