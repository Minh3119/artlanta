package model.json;

public class UnsendMessagePayload {
    private String action;
    private int messageId;
    private int currentUserId;

    public String getAction() {return action;}
    public void setAction(String action) {this.action = action;}

    public int getMessageId() {return messageId;}
    public void setMessageId(int messageId) {this.messageId = messageId;}

    public int getCurrentUserId() {return currentUserId;}
    public void setCurrentUserId(int currentUserId) {this.currentUserId = currentUserId;}
}
