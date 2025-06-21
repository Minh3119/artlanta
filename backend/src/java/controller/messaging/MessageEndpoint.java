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

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.json.JSONObject;

import com.google.gson.JsonSyntaxException;

import dto.SendMessagePayload;
import dto.UnsendMessagePayload;


@ServerEndpoint(value = "/ws/message", configurator = HttpSessionConfigurator.class)
public class MessageEndpoint {

    // private static final Map<String, Session> sessions = new ConcurrentHashMap<>();
    private static final Map<Integer, Session> connectedUsers = new ConcurrentHashMap<>();

    private MessagingService messagingService;

    @OnOpen
    public void open(Session session, EndpointConfig conf) {
        messagingService = new MessagingService();

        // String sessionId = session.getId();
        // sessions.put(sessionId, session);

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
        // sessions.remove(session.getId());
        int userId = (int) session.getUserProperties().get("userId");
        connectedUsers.remove(userId);  // remove userId from the global map
        System.out.println("WebSocket closed by user: " + userId + " with reason: " + reason.getReasonPhrase());
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
