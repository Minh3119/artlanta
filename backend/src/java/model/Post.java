package model;

import java.time.LocalDateTime;

public class Post {

    private int ID;
    private int userID;
    private String content;
    private boolean isDraft;
    private String visibility;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isFlagged;

    public Post(int ID, int userID, String content, boolean isDraft, String visibility,
            LocalDateTime createdAt, LocalDateTime updatedAt, boolean isFlagged) {
        this.ID = ID;
        this.userID = userID;
        this.content = content;
        this.isDraft = isDraft;
        this.visibility = visibility;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isFlagged = isFlagged;
    }

    public int getID() {
        return ID;
    }

    public int getUserID() {
        return userID;
    }

    public String getContent() {
        return content;
    }

    public boolean isDraft() {
        return isDraft;
    }

    public String getVisibility() {
        return visibility;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public boolean isFlagged() {
        return isFlagged;
    }
}
