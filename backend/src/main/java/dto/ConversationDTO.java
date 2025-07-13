package dto;

import model.Conversation;
import model.User;
import model.Message;

public class ConversationDTO {
    private Conversation conversation;
    private User otherUser;
    private Message latestMessage;

    public ConversationDTO(Conversation conversation, User otherUser, Message latestMessage) {
        this.conversation = conversation;
        this.otherUser = otherUser;
        this.latestMessage = latestMessage;
    }

    // Getters
    public Conversation getConversation() { return conversation; }
    public User getOtherUser() { return otherUser; }
    public Message getLatestMessage() { return latestMessage; }
}
