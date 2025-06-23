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

    /**
     * Default constructor
     */
    public Post() {
    }

    /**
     * Parameterized constructor
     */
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

    public void setID(int ID) {
        this.ID = ID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isDraft() {
        return isDraft;
    }

    public void setIsDraft(boolean isDraft) {
        this.isDraft = isDraft;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setIsFlagged(boolean isFlagged) {
        this.isFlagged = isFlagged;
    }
}
