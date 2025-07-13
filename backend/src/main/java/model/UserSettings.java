package model;

public class UserSettings {
    private int userID;
    private boolean notifyLike;
    private boolean notifyComment;
    private boolean notifyCommission;
    private String language;

    public UserSettings(int userID, boolean notifyLike, boolean notifyComment, boolean notifyCommission, String language) {
        this.userID = userID;
        this.notifyLike = notifyLike;
        this.notifyComment = notifyComment;
        this.notifyCommission = notifyCommission;
        this.language = language;
    }

    public int getUserID() {
        return userID;
    }

    public boolean isNotifyLike() {
        return notifyLike;
    }

    public boolean isNotifyComment() {
        return notifyComment;
    }

    public boolean isNotifyCommission() {
        return notifyCommission;
    }

    public String getLanguage() {
        return language;
    }

} 