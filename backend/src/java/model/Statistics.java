package model;

public class Statistics {
    private int posts;
    private int followers;
    private int following;
    private int likesReceived;
    private int commentsMade;
    private int repliesReceived;
    private int flagsReceived;
    private double votesPerPost;

    public Statistics() {
    }

    public Statistics(int posts, int followers, int following, int likesReceived, int commentsMade, int repliesReceived, int flagsReceived, double votesPerPost) {
        this.posts = posts;
        this.followers = followers;
        this.following = following;
        this.likesReceived = likesReceived;
        this.commentsMade = commentsMade;
        this.repliesReceived = repliesReceived;
        this.flagsReceived = flagsReceived;
        this.votesPerPost = votesPerPost;
    }
    
    public int getFlagsReceived() {
        return flagsReceived;
    }

    public void setFlagsReceived(int flagsReceived) {
        this.flagsReceived = flagsReceived;
    }
    
    public double getVotesPerPost() {
        return votesPerPost;
    }

    public void setVotesPerPost(double votesPerPost) {
        this.votesPerPost = votesPerPost;
    }

    public int getPosts() {
        return posts;
    }

    public void setPosts(int posts) {
        this.posts = posts;
    }

    public int getFollowers() {
        return followers;
    }

    public void setFollowers(int followers) {
        this.followers = followers;
    }

    public int getFollowing() {
        return following;
    }

    public void setFollowing(int following) {
        this.following = following;
    }

    public int getLikesReceived() {
        return likesReceived;
    }

    public void setLikesReceived(int likesReceived) {
        this.likesReceived = likesReceived;
    }

    public int getCommentsMade() {
        return commentsMade;
    }

    public void setCommentsMade(int commentsMade) {
        this.commentsMade = commentsMade;
    }

    public int getRepliesReceived() {
        return repliesReceived;
    }

    public void setRepliesReceived(int repliesReceived) {
        this.repliesReceived = repliesReceived;
    }

    @Override
    public String toString() {
        return "Statistics{" +
                "posts=" + posts +
                ", followers=" + followers +
                ", following=" + following +
                ", likesReceived=" + likesReceived +
                ", commentsMade=" + commentsMade +
                ", repliesReceived=" + repliesReceived +
                ", flagsReceived=" + flagsReceived +
                ", votesPerPost=" + votesPerPost +
                '}';
    }

    
}
