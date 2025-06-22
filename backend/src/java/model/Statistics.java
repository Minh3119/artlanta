package model;

public class Statistics {
    private int posts;
    private int followers;
    private int following;
    private int likesReceived;
    private int commentsMade;
    private int repliesReceived;

    public Statistics() {
        this.posts = 0;
        this.followers = 0;
        this.following = 0;
        this.likesReceived = 0;
        this.commentsMade = 0;
        this.repliesReceived = 0;
    }

    public Statistics(int posts, int followers, int following, int likesReceived, int commentsMade, int repliesReceived) {
        this.posts = posts;
        this.followers = followers;
        this.following = following;
        this.likesReceived = likesReceived;
        this.commentsMade = commentsMade;
        this.repliesReceived = repliesReceived;
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

    
}
