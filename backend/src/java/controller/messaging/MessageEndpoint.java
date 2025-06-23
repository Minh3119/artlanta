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
import model.json.SendMessagePayload;
import model.json.UnsendMessagePayload;
import service.MessagingService;
import util.JsonUtil;
import util.SessionUtil;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONObject;


@ServerEndpoint(value = "/ws/message", configurator = HttpSessionConfigurator.class)
public class MessageEndpoint {

    // private static final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private static final Map<Integer, Session> connectedUsers = new ConcurrentHashMap<>();

    private MessagingService messagingService;

    @OnOpen
    public void open(Session session, EndpointConfig conf) {
        try {
            messagingService = new MessagingService();

            HttpSession httpSession = (HttpSession) conf.getUserProperties().get(HttpSession.class.getName());
            if (httpSession == null) {
                System.out.println("HttpSession not found. Closing WebSocket connection.");
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Authentication required"));
                return;
            }

            Integer userId = SessionUtil.getCurrentUserId(httpSession);
            if (userId == null) {
                System.out.println("User not authenticated. Closing WebSocket connection.");
                session.close(new CloseReason(CloseReason.CloseCodes.VIOLATED_POLICY, "Not authenticated"));
                return;
            }

            System.out.println("WebSocket opened by user: " + userId);
            session.getUserProperties().put("userId", userId);
            connectedUsers.put(userId, session);
        } catch (IOException e) {
            // System.err.println("Error during WebSocket opening: " + e.getMessage());
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.UNEXPECTED_CONDITION, e.getMessage()));
            } catch (IOException ex) {
                System.err.println("Error closing session: " + ex.getMessage());
            }
        }
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        try {
            Object userIdObj = session.getUserProperties().get("userId");
            if (userIdObj != null) {
                int userId = (int) userIdObj;
                connectedUsers.remove(userId);
                System.out.println("WebSocket closed by user: " + userId + " with reason: " + reason.getReasonPhrase());
            } else {
                System.out.println("WebSocket closed for unknown user with reason: " + reason.getReasonPhrase());
            }
        } catch (Exception e) {
            System.err.println("Error during WebSocket close: " + e.getMessage());
        }
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
        SendMessagePayload payload = JsonUtil.fromJsonString(msg, SendMessagePayload.class);
        String responseJsonString = messagingService.handleSendMessage(payload);

        // 3. Broadcast to recipient and sender
        try {
            int recipientId = messagingService.getRecipientId(payload.getConversationId(), payload.getSenderId());
            if (connectedUsers.containsKey(recipientId)) {
                Session recipientSession = connectedUsers.get(recipientId);
                if (recipientSession.isOpen()) {
                    recipientSession.getBasicRemote().sendText(responseJsonString);
                }
            }

            if (connectedUsers.containsKey(payload.getSenderId())) {
                Session senderSession = connectedUsers.get(payload.getSenderId());
                if (senderSession.isOpen()) {
                    senderSession.getBasicRemote().sendText(responseJsonString);
                }
            }
            
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void handleUnsendMessage(Session session, String msg) {
        UnsendMessagePayload payload = JsonUtil.fromJsonString(msg, UnsendMessagePayload.class);
        
        JSONObject response = messagingService.handleUnsendMessage(payload);
        String responseJsonString = response.toString();

        // 3. Broadcast unsend event if success
        try {
            
            // send to sender
            if (connectedUsers.containsKey(payload.getCurrentUserId())) {
                Session senderSession = connectedUsers.get(payload.getCurrentUserId());
                if (senderSession.isOpen())
                    senderSession.getBasicRemote().sendText(responseJsonString);
            }
            // send to recipient
            int recipientId = messagingService.getRecipientId(response.getInt("conversationId"), payload.getCurrentUserId());
            if (connectedUsers.containsKey(recipientId)) {
                Session recipientSession = connectedUsers.get(recipientId);
                if (recipientSession.isOpen())
                    recipientSession.getBasicRemote().sendText(responseJsonString);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
