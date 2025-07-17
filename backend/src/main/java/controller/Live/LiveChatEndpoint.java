package controller.Live;

import controller.messaging.HttpSessionConfigurator;
import dal.LiveDAO;

import jakarta.servlet.http.HttpSession;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;

import model.LiveChatMessage;

@ServerEndpoint(value = "/api/live/chat",
        encoders = {ChatMessageEncode.class},
        configurator = HttpSessionConfigurator.class)
public class LiveChatEndpoint {

    private static final Map<String, Set<Session>> roomMap = new HashMap<>();
    private static final Map<String, Timer> roomTimers = new ConcurrentHashMap<>();
    private static final Map<String, Integer> roomCountdowns = new ConcurrentHashMap<>();
    private static final int AUCTION_TIME = 60;
    
    
    private void startAuctionTimer(String roomID) {
        if (roomTimers.containsKey(roomID)) return;
        roomCountdowns.put(roomID, AUCTION_TIME);
        Timer timer = new Timer(true);
        roomTimers.put(roomID, timer);
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                int timeLeft = roomCountdowns.get(roomID) - 1;
                if (timeLeft <= 0) {
                    // Reset
                    timeLeft = AUCTION_TIME;
                }
                roomCountdowns.put(roomID, timeLeft);
                broadcastTime(roomID, timeLeft);
            }
        }, 0, 1000);
    }
    private void broadcastTime(String roomID, int timeLeft) {
        synchronized (roomMap) {
            Set<Session> sessions = roomMap.get(roomID);
            if (sessions != null) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
                        try {
                            session.getBasicRemote().sendText("{\"Type\":\"Timer\",\"Message\":" + timeLeft + "}");
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        String ID = getLiveID(session);
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        String Username = "Anonymous";
        String UserID = "0";
        if (httpSession != null && httpSession.getAttribute("user") != null) {
            Username = String.valueOf(httpSession.getAttribute("user"));
            UserID = String.valueOf(httpSession.getAttribute("userId"));
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
        session.getUserProperties().put("UserID", UserID);
        session.getUserProperties().put("Username", Username);
        
        startAuctionTimer(ID);

    }

    @OnMessage
    public void onMessage(String message, Session senderSession) throws IOException, EncodeException {
        String ID = String.valueOf(senderSession.getUserProperties().get("ID"));
        String UserID = String.valueOf(senderSession.getUserProperties().get("UserID"));
        String Username = String.valueOf(senderSession.getUserProperties().get("Username"));
        String Type;
        if (message.startsWith("#bid")) {
            Type = "Bid";
        } else {
            Type = "Chat";
        }

        if (ID == null) {
            return;
        }
        LiveDAO ld = new LiveDAO();
        LiveChatMessage l=new LiveChatMessage(UserID, Username, Type, message);
        System.out.println("obj:"+l.toString());
        System.out.println("postID"+ID);
        ld.insertLiveMessage(new LiveChatMessage(UserID, Username, Type, message), ID);
        synchronized (roomMap) {
            Set<Session> sessionsInRoom = roomMap.get(ID);
            if (sessionsInRoom != null) {
                for (Session session : sessionsInRoom) {
                    if (session.isOpen()) {

                        session.getBasicRemote().sendObject(new LiveChatMessage(UserID, Username, Type, message));
//                        session.getBasicRemote().sendObject(new LiveChatMessage( Username, message));
                    }
                }
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        String ID = String.valueOf(session.getUserProperties().get("ID"));
        if (ID != null) {
            synchronized (roomMap) {
                Set<Session> sessions = roomMap.get(ID);
                if (sessions != null) {
                    sessions.remove(session);
                    if (sessions.isEmpty()) {
                        roomMap.remove(ID);
                        
                        Timer timer = roomTimers.remove(ID);
                        if (timer != null) timer.cancel();
                        roomCountdowns.remove(ID);
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
            URI uri = new URI(session.getRequestURI().toString() + session.getQueryString());
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
