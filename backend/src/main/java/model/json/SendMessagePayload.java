package model.json;

public class SendMessagePayload {
    private String action;
    private int conversationId;
    private int senderId;
    private MessageContent content; // generic

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public int getConversationId() {
        return conversationId;
    }

    public void setConversationId(int conversationId) {
        this.conversationId = conversationId;
    }

    public int getSenderId() {
        return senderId;
    }

    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    public MessageContent getContent() {
        return content;
    }

    public void setContent(MessageContent content) {
        this.content = content;
    }
}
