package model;

public class SavedPost {
    private int userId;
    private int postId;

    public SavedPost() {}

    public SavedPost(int userId, int postId) {
        this.userId = userId;
        this.postId = postId;
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