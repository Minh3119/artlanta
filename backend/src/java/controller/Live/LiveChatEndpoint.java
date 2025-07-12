
package controller.Live;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collections;
import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
@ServerEndpoint(value = "/api/live/chat")
public class LiveChatEndpoint{

    private static final Map<String, Set<Session>> roomMap = new HashMap<>();

    @OnOpen
    public void onOpen(Session session) {
        String ID = getLiveID(session);
        if (ID == null) {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.CANNOT_ACCEPT, "Missing ID"));
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

        synchronized (roomMap) {
            roomMap.putIfAbsent(ID, new HashSet<>());
            roomMap.get(ID).add(session);
        }

        session.getUserProperties().put("ID", ID);
        System.out.println("User joined room: " + ID + " sessionID=" + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session senderSession) throws IOException {
        String ID = (String) senderSession.getUserProperties().get("ID");
        if (ID == null) return;

        synchronized (roomMap) {
            Set<Session> sessionsInRoom = roomMap.get(ID);
            if (sessionsInRoom != null) {
                for (Session session : sessionsInRoom) {
                    if (session.isOpen()) {
                        session.getBasicRemote().sendText(message);
                    }
                }
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        String ID = (String) session.getUserProperties().get("ID");
        if (ID != null) {
            synchronized (roomMap) {
                Set<Session> sessions = roomMap.get(ID);
                if (sessions != null) {
                    sessions.remove(session);
                    if (sessions.isEmpty()) {
                        roomMap.remove(ID); // dọn rác nếu không còn ai
                    }
                }
            }
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("WebSocket error: " + throwable.getMessage());
    }

    private String getLiveID(Session session) {
        try {
            URI uri = new URI(session.getRequestURI().toString() + "?" + session.getQueryString());
            String query = uri.getQuery(); 
            if (query != null && query.contains("ID=")) {
                return query.split("ID=")[1];
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
