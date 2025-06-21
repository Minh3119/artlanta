package dto;

public class MessageContent {
    private String text;
    private MessageMedia media;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public MessageMedia getMedia() {
        return media;
    }

    public void setMedia(MessageMedia media) {
        this.media = media;
    }
}
