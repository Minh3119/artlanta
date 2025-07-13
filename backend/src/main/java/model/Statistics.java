package model;

public class Statistics {
    private int posts;
    private int followers;
    private int following;
    private int likesReceived;
    private int commentsMade;
    private int repliesReceived;
    private double commentsPerPost;
    private double votesPerPost;
    public boolean getCommentsPerPost;

    public Statistics() {
    }

    public Statistics(int posts, int followers, int following, int likesReceived, int commentsMade, int repliesReceived, int commentPerPost, double votesPerPost) {
        this.posts = posts;
        this.followers = followers;
        this.following = following;
        this.likesReceived = likesReceived;
        this.commentsMade = commentsMade;
        this.repliesReceived = repliesReceived;
        this.commentsPerPost = commentPerPost;
        this.votesPerPost = votesPerPost;
    }
    
    public double getCommentsPerPost() {
        return commentsPerPost;
    }

    public void setCommentsPerPost(double commentsPerPost) {
        this.commentsPerPost = commentsPerPost;
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
                ", commentPerPost=" +  commentsPerPost +
                ", votesPerPost=" + votesPerPost +
                '}';
    }

    
}
