package model;

import java.time.LocalDateTime;

public class TopPost extends Post {
    private String title;
    private int likeInteractions;
    private int commentInteractions;
    private int totalInteractions;

    public TopPost() {
        super(0, 0, null, false, null, null, null, false);
    }

    // New minimal constructor: postId, userId, title, and interaction fields
    public TopPost(int postId, int userId, String title, int likeInteractions, int commentInteractions, int totalInteractions) {
        super(postId, userId, null, false, null, null, null, false);
        this.title = title;
        this.likeInteractions = likeInteractions;
        this.commentInteractions = commentInteractions;
        this.totalInteractions = totalInteractions;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
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
