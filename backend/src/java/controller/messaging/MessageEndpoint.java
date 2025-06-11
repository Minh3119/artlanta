package controller.messaging;

import jakarta.websocket.CloseReason;
import jakarta.websocket.EndpointConfig;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.ServerEndpoint;


@ServerEndpoint("/ws/message")
public class MessageEndpoint {
    @OnOpen
    public void open(Session session, EndpointConfig conf) {
    }

    @OnMessage
    public void onMessage(Session session, String msg) {
        try {
            session.getBasicRemote().sendText("Server received: " + msg + "from" + session.getRequestURI());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnError
    public void onError(Session session, Throwable error) {
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
    }
}
