package model;

import java.time.LocalDateTime;

public class Notification {
    private int ID;
    private int userID;
    private String type;
    private String content;
    private Integer postID;  // Can be null
    private boolean isRead;
    private LocalDateTime createdAt;

    public Notification(int ID, int userID, String type, String content, Integer postID, boolean isRead, LocalDateTime createdAt) {
        this.ID = ID;
        this.userID = userID;
        this.type = type;
        this.content = content;
        this.postID = postID;
        this.isRead = isRead;
        this.createdAt = createdAt;
    }

    public int getID() {
        return ID;
    }

    public int getUserID() {
        return userID;
    }

    public String getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public Integer getPostID() {
        return postID;
    }

    public boolean isRead() {
        return isRead;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

} 