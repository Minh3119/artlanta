package dto;

import model.Conversation;
import model.User;
import model.Message;

public class ConversationListDTO {
    private Conversation conversation;
    private User user1;
    private User user2;
    private Message latestMessage;

    public ConversationListDTO(Conversation conversation, User user1, User user2, Message latestMessage) {
        this.conversation = conversation;
        this.user1 = user1;
        this.user2 = user2;
        this.latestMessage = latestMessage;
    }

    // Getters
    public Conversation getConversation() { return conversation; }
    public User getUser1() { return user1; }
    public User getUser2() { return user2; }
    public Message getLatestMessage() { return latestMessage; }
}
