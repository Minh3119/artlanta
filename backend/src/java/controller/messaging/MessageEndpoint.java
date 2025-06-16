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
import util.SessionUtil;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONObject;


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
    }


    @OnMessage
    public void onMessage(Session session, String msg) {
        try {
            JSONObject json = new JSONObject(msg);
            int conversationId = json.getInt("conversationId");
            int senderId = json.getInt("senderId");
            int recipientId = json.getInt("recipientId");
            String content = json.getString("content");

            // 1. Save the message to the database
            model.Message newMessage = messagingService.createMessage(conversationId, senderId, content, null); // Assuming no mediaUrl for now

            if (newMessage != null) {
                // 2. Convert the persisted message to a JSON object
                JSONObject messageJson = buildMessageJson(newMessage);

                // 3. Broadcast the message to the recipient if they are connected
                if (connectedUsers.containsKey(recipientId)) {
                    Session recipientSession = connectedUsers.get(recipientId);
                    if (recipientSession.isOpen()) {
                        recipientSession.getBasicRemote().sendText(messageJson.toString());
                    }
                }

                // 4. Send the message back to the sender for UI confirmation
                if (connectedUsers.containsKey(senderId)) {
                    Session senderSession = connectedUsers.get(senderId);
                    if (senderSession.isOpen()) {
                        senderSession.getBasicRemote().sendText(messageJson.toString());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private JSONObject buildMessageJson(model.Message message) {
        JSONObject messageJson = new JSONObject();
        messageJson.put("id", message.getId());
        messageJson.put("conversationId", message.getConversationId());
        messageJson.put("senderId", message.getSenderId());
        messageJson.put("content", message.getContent());
        messageJson.put("mediaUrl", message.getMediaUrl() != null ? message.getMediaUrl() : JSONObject.NULL);
        messageJson.put("createdAt", message.getCreatedAt().toString());
        messageJson.put("isRead", false); // New messages are initially unread
        return messageJson;
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.err.println("Error on session " + session.getId() + ": " + error.getMessage());
        error.printStackTrace();
    }

}
