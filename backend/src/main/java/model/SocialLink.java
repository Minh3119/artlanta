package model;

import java.time.LocalDateTime;

public class SocialLink {
    private int ID;
    private int userID;
    private String platform;
    private String url;
    private LocalDateTime createdAt;

    public SocialLink(int ID, int userID, String platform, String url, LocalDateTime createdAt) {
        this.ID = ID;
        this.userID = userID;
        this.platform = platform;
        this.url = url;
        this.createdAt = createdAt;
    }

    public int getID() {
        return ID;
    }

    public int getUserID() {
        return userID;
    }

    public String getPlatform() {
        return platform;
    }

    public String getUrl() {
        return url;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

}
