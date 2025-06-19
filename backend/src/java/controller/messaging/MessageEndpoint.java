package controller.messaging;

import jakarta.servlet.http.HttpSession;
import jakarta.websocket.CloseReason;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;
import service.MessagingService;
import util.JsonUtil;
import util.SessionUtil;
import model.Message;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONObject;

import com.google.gson.JsonSyntaxException;


@ServerEndpoint(value = "/ws/message", configurator = HttpSessionConfigurator.class)
public class MessageEndpoint {

    private static final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private static final Map<Integer, Session> connectedUsers = new ConcurrentHashMap<>();

    private MessagingService messagingService;

    @OnOpen
    public void open(Session session, EndpointConfig conf) {
        messagingService = new MessagingService();

        String sessionId = session.getId();
        sessions.put(sessionId, session);

        HttpSession httpSession = (HttpSession) conf.getUserProperties().get(HttpSession.class.getName());
        if (httpSession != null) {
            int userId = SessionUtil.getCurrentUserId(httpSession);
            System.out.println("WebSocket opened by user: " + userId);
            session.getUserProperties().put("userId", userId);  // store userId in this WS session only
            connectedUsers.put(userId, session);  // store userId in the global map
        } else {
            System.out.println("HttpSession not found.");
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        sessions.remove(session.getId());
        int userId = (int) session.getUserProperties().get("userId");
        connectedUsers.remove(userId);  // remove userId from the global map
        messagingService.close();
    }


    @OnMessage
    public void onMessage(Session session, String msg) {
        JSONObject json = new JSONObject(msg);
        switch (json.getString("action")) {
            case "send":
                handleSendMessage(session, msg);
                break;

            case "unsend":
                handleUnsendMessage(session, msg);
                break;
        
            default:
                break;
        }

    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.err.println("Error on session " + session.getId() + ": " + error.getMessage());
        error.printStackTrace();
    }

    private void handleSendMessage(Session session, String msg) {
        try {
            // 0. Parse Payload
            SendMessageRequest payload = JsonUtil.fromJsonString(msg, SendMessageRequest.class);

            // 1. Create new Message in Database (persisted message)
            String text = payload.getContent() != null ? payload.getContent().getText() : null;
            Message toCreate = new Message(-1, payload.getConversationId(), payload.getSenderId(), text, null, null, false, null);
            Message newMessage = messagingService.createMessage(toCreate);

            if (newMessage == null) {
                throw new Exception("Failed to create message.");
            }

            // 2. Convert the persisted message to JSON
            SendMessageResponse response = new SendMessageResponse();
            response.setAction("send");
            response.setMessage(newMessage);
            String responseJsonString = JsonUtil.toJsonString(response);

            // 3. Determine recipient
            int recipientId = messagingService.getRecipientId(payload.getConversationId(), payload.getSenderId());
            if (connectedUsers.containsKey(recipientId)) {
                Session recipientSession = connectedUsers.get(recipientId);
                if (recipientSession.isOpen()) {
                    recipientSession.getBasicRemote().sendText(responseJsonString);
                }
            }

            // 4. Send the message back to the sender for UI confirmation
            if (connectedUsers.containsKey(payload.getSenderId())) {
                Session senderSession = connectedUsers.get(payload.getSenderId());
                if (senderSession.isOpen()) {
                    senderSession.getBasicRemote().sendText(responseJsonString);
                }
            }
        } catch (JsonSyntaxException e) {
            System.out.println("Failed to parse JSON");
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private void handleUnsendMessage(Session session, String msg) {
        try {
            // 0. Parse Payload
            UnsendMessageRequest payload = JsonUtil.fromJsonString(msg, UnsendMessageRequest.class);

            // 1. Delete message in database
            boolean success = messagingService.deleteMessage(payload.getMessageId(), payload.getCurrentUserId());

            if (!success) throw new Exception("Failed to delete message.");

            // Broadcast unsend event if success
            model.Message deleted = messagingService.getMessageById(payload.getMessageId());
            int recipientId = messagingService.getRecipientId(deleted.getConversationId(), payload.getCurrentUserId());
            JSONObject response = new JSONObject();
            response.put("action", "unsend");
            response.put("messageId", payload.getMessageId());
            String responseStr = response.toString();

            // send to sender
            if (connectedUsers.containsKey(payload.getCurrentUserId())) {
                Session senderSession = connectedUsers.get(payload.getCurrentUserId());
                if (senderSession.isOpen()) senderSession.getBasicRemote().sendText(responseStr);
            }
            // send to recipient
            if (connectedUsers.containsKey(recipientId)) {
                Session recipientSession = connectedUsers.get(recipientId);
                if (recipientSession.isOpen()) recipientSession.getBasicRemote().sendText(responseStr);
            }
            
        } catch (JsonSyntaxException e) {
            System.out.println("Failed to parse JSON");
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}

class UnsendMessageRequest {
    private String action;
    private int messageId; // messageId
    private int currentUserId;

    public String getAction() {return action;}
    public void setAction(String action) {this.action = action;}

    public int getMessageId() {return messageId;}
    public void setMessageId(int messageId) {this.messageId = messageId;}

    public int getCurrentUserId() {return currentUserId;}
    public void setCurrentUserId(int currentUserId) {this.currentUserId = currentUserId;}

}


class SendMessageRequest {
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

class SendMessageResponse {
    private String action;
    private Message message;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Message getMessage() { return message; }
    public void setMessage(Message message) { this.message = message; }

}

class MessageContent {
    private String text;          // optional
    private MessageMedia media;          // optional

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

class MessageMedia {
    private String type;          // "image", "video", "file", etc.
    private String url;           // CDN or backend-served URL
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