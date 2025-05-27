package model;

import java.time.LocalDateTime;

public class Comment {
    private int ID;
    private int postID;
    private int userID;
    private String content;
    private String mediaURL;
    private Integer parentID;
    private LocalDateTime createdAt;
    private boolean isFlagged;

    public Comment(int ID, int postID, int userID, String content, String mediaURL, Integer parentID, LocalDateTime createdAt, boolean isFlagged) {
        this.ID = ID;
        this.postID = postID;
        this.userID = userID;
        this.content = content;
        this.mediaURL = mediaURL;
        this.parentID = parentID;
        this.createdAt = createdAt;
        this.isFlagged = isFlagged;
    }

    public int getID() {
        return ID;
    }

    public int getPostID() {
        return postID;
    }

    public int getUserID() {
        return userID;
    }

    public String getContent() {
        return content;
    }

    public String getMediaURL() {
        return mediaURL;
    }

    public Integer getParentID() {
        return parentID;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

} 