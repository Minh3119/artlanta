
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
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class LiveChatEndpoint extends HttpServlet {

    private static final Map<String, Set<Session>> roomMap = new HashMap<>();

    @OnOpen
    public void onOpen(Session session) {
        String liveID = getLiveID(session);
        if (liveID == null) {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.CANNOT_ACCEPT, "Missing ID"));
            } catch (IOException e) {
                e.printStackTrace();
            }
            return;
        }

        synchronized (roomMap) {
            roomMap.putIfAbsent(liveID, new HashSet<>());
            roomMap.get(liveID).add(session);
        }

        session.getUserProperties().put("liveID", liveID);
        System.out.println("User joined room: " + liveID + " sessionID=" + session.getId());
    }

    @OnMessage
    public void onMessage(String message, Session senderSession) throws IOException {
        String liveID = (String) senderSession.getUserProperties().get("liveID");
        if (liveID == null) return;

        synchronized (roomMap) {
            Set<Session> sessionsInRoom = roomMap.get(liveID);
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
        String liveID = (String) session.getUserProperties().get("liveID");
        if (liveID != null) {
            synchronized (roomMap) {
                Set<Session> sessions = roomMap.get(liveID);
                if (sessions != null) {
                    sessions.remove(session);
                    if (sessions.isEmpty()) {
                        roomMap.remove(liveID); // dọn rác nếu không còn ai
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
            String query = uri.getQuery(); // ví dụ: liveID=abc123
            if (query != null && query.contains("liveID=")) {
                return query.split("liveID=")[1];
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
