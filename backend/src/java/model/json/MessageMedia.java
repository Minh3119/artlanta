package model.json;

public class MessageMedia {
    private String type;          // "image", "video", "file", etc.
    private String url = null;    // CDN or backend-served URL
    private String mediaId;       // optional, e.g. UUID

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getMediaId() {
        return mediaId;
    }

    public void setMediaId(String mediaId) {
        this.mediaId = mediaId;
    }
}
