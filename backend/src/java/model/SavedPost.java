package model;

public class SavedPost {
    private int id;
    private int userId;
    private int postId;

    public SavedPost() {}

    public SavedPost(int id, int userId, int postId) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getPostId() {
        return postId;
    }

    public void setPostId(int postId) {
        this.postId = postId;
    }
}