package model;

import java.time.LocalDateTime;

public class Review {
    private int ID;
    private int commissionID;
    private int reviewerID;
    private int rating;  // 1 to 5
    private String comment;
    private LocalDateTime reviewAt;

    public Review(int ID, int commissionID, int reviewerID, int rating, String comment, LocalDateTime reviewAt) {
        this.ID = ID;
        this.commissionID = commissionID;
        this.reviewerID = reviewerID;
        this.rating = rating;
        this.comment = comment;
        this.reviewAt = reviewAt;
    }

    public int getID() {
        return ID;
    }

    public int getCommissionID() {
        return commissionID;
    }

    public int getReviewerID() {
        return reviewerID;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    public LocalDateTime getReviewAt() {
        return reviewAt;
    }

} 