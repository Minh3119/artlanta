package model;

import java.time.LocalDateTime;

public class TopUser extends User {
    private int likeInteractions;
    private int commentInteractions;
    private int totalInteractions;

    public TopUser() {
        super(0, null, null, null, null, null, null, false, null, null, null, null, null, null, null, false, false);
    }

    // Minimal constructor: userId, username, and interaction fields
    public TopUser(int userId, String username, int likeInteractions, int commentInteractions, int totalInteractions) {
        super(userId, username, null, null, null, null, null, false, null, null, null, null, null, null, null, false, false);
        this.likeInteractions = likeInteractions;
        this.commentInteractions = commentInteractions;
        this.totalInteractions = totalInteractions;
    }

    public int getLikeInteractions() {
        return likeInteractions;
    }
    public void setLikeInteractions(int likeInteractions) {
        this.likeInteractions = likeInteractions;
    }

    public int getCommentInteractions() {
        return commentInteractions;
    }
    public void setCommentInteractions(int commentInteractions) {
        this.commentInteractions = commentInteractions;
    }

    public int getTotalInteractions() {
        return totalInteractions;
    }
    public void setTotalInteractions(int totalInteractions) {
        this.totalInteractions = totalInteractions;
    }
}
