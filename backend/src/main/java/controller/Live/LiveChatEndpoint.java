package controller.Live;

import controller.messaging.HttpSessionConfigurator;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
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
import model.LiveChatMessage;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;

@ServerEndpoint(value = "/api/live/chat",
        encoders = {ChatMessageEncode.class},
        configurator = HttpSessionConfigurator.class)
public class LiveChatEndpoint {

    private static final Map<String, Set<Session>> roomMap = new HashMap<>();
    private static final Map<String, Integer> roomTimers = new HashMap<>();
    private static final Map<String, Thread> timerThreads = new HashMap<>();

    private void startTimerForRoom(String ID, int startTimeInSeconds) {
        if (timerThreads.containsKey(ID)) {
            return;
        }
        Thread timerThread = new Thread(() -> {
            int time = startTimeInSeconds;
            roomTimers.put(ID, time);
            while (time >= 0) {
                synchronized (roomMap) {
                    Set<Session> sessions = roomMap.get(ID);
                    if (sessions != null) {
                        for (Session session : sessions) {
                            if (session.isOpen()) {
                                try {
                                    session.getBasicRemote().sendText(
                                            new JSONObject()
                                                    .put("Type", "Timer")
                                                    .put("Timer", time)
                                                    .toString()
                                    );
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                    }
                }
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    return;
                }
                time--;
            }

            // timeout
            synchronized (roomMap) {
                roomTimers.remove(ID);
                timerThreads.remove(ID);
            }
        });

        timerThread.start();
        timerThreads.put(ID, timerThread);
    }

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        String ID = getLiveID(session);
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        String Username = "Anonymous";
        if (httpSession != null && httpSession.getAttribute("user") != null) {
            Username = (String) httpSession.getAttribute("user");
        }
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
        session.getUserProperties().put("Username", Username);


        if (!roomTimers.containsKey(ID)) {
            startTimerForRoom(ID, 60);
        } else {
            int currentTimeLeft = roomTimers.get(ID);
            try {
                session.getBasicRemote().sendText(
                        new JSONObject()
                                .put("Type", "Timer")
                                .put("Timer", currentTimeLeft)
                                .toString()
                );
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @OnMessage
    public void onMessage(String message, Session senderSession) throws IOException, EncodeException {
        String ID = (String) senderSession.getUserProperties().get("ID");
        String Username = (String) senderSession.getUserProperties().get("Username");
        String Type;
        if (message.startsWith("Bid")) {
            Type = "Bid";
        } else {
            Type = "Chat";
        }
//        else{
//            Type= "Timer";
//        }

        if (ID == null) {
            return;
        }

        synchronized (roomMap) {
            Set<Session> sessionsInRoom = roomMap.get(ID);
            if (sessionsInRoom != null) {
                for (Session session : sessionsInRoom) {
                    if (session.isOpen()) {
//                        session.getBasicRemote().sendText(message);
                        session.getBasicRemote().sendObject(new LiveChatMessage(ID, Username, Type, message));
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
                        roomMap.remove(ID);
                        Thread t = timerThreads.remove(ID);
                        if (t != null) {
                            t.interrupt();
                        }
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
