package model;
import java.time.LocalDateTime;

public class Posts {

    int id;
    int userId;
    String title;
    String content;
    String mediaUrl;
    boolean isDraft;
    String visibility;
    LocalDateTime createdAt;
    // Assuming datetime is a class that handles date and time
    // If not, you might want to use java.util.Date or java.time.LocalDateTime
    // and import the necessary packages accordingly.me createdAt;
    LocalDateTime updatedAt;
    boolean isDeleted;

    public Posts() {
    }

    public Posts(int id, int userId, String title, String content, String mediaUrl, boolean isDraft, String visibility, LocalDateTime createdAt, LocalDateTime updatedAt, boolean isDeleted) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.mediaUrl = mediaUrl;
        this.isDraft = isDraft;
        this.visibility = visibility;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.isDeleted = isDeleted;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean draft) {
        isDraft = draft;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}
