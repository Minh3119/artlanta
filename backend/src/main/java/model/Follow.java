package model;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class Follow {
    private int id;
    private int followerId;
    private int followedId;
    private String status;
    private LocalDateTime followAt;
    private String username;
    private String avatarUrl;

    public Follow() {
    }

    public Follow(int id, int followerId, int followedId, String status, LocalDateTime followAt) {
        this.id = id;
        this.followerId = followerId;
        this.followedId = followedId;
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

    public int getFollowedId() {
        return followedId;
    }

    public void setFollowedId(int followedId) {
        this.followedId = followedId;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
