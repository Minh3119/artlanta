package model;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Follow {
    private int id;
    private int followerId;
    private int followingId;
    private String status;
    private LocalDateTime followAt;

    public Follow() {
    }

    public Follow(int id, int followerId, int followingId, String status, LocalDateTime followAt) {
        this.id = id;
        this.followerId = followerId;
        this.followingId = followingId;
        this.status = status;
        this.followAt = followAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getFollowerId() {
        return followerId;
    }

    public void setFollowerId(int followerId) {
        this.followerId = followerId;
    }

    public int getFollowingId() {
        return followingId;
    }

    public void setFollowingId(int followingId) {
        this.followingId = followingId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getFollowAt() {
        return followAt;
    }

    public void setFollowAt(LocalDateTime followAt) {
        this.followAt = followAt;
    }
}
