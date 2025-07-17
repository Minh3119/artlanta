package controller.Live;

import controller.messaging.HttpSessionConfigurator;
import dal.AuctionDAO;
import dal.LiveDAO;

import jakarta.servlet.http.HttpSession;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.net.URI;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ConcurrentHashMap;
import model.Auction;

import model.LiveChatMessage;
import model.MaxBidInfo;

@ServerEndpoint(value = "/api/live/chat",
        encoders = {ChatMessageEncode.class},
        configurator = HttpSessionConfigurator.class)
public class LiveChatEndpoint {

    private static final Map<String, Set<Session>> roomMap = new HashMap<>();
    private static final Map<String, Timer> roomTimers = new ConcurrentHashMap<>();
    private static final Map<String, Integer> roomCountdowns = new ConcurrentHashMap<>();
    private static final Map<String, Map<Integer, MaxBidInfo>> roomAuctionBids = new ConcurrentHashMap<>();
    private static final Map<String, Set<Integer>> hiddenAuctions = new ConcurrentHashMap<>();
    private static final int AUCTION_TIME = 60;
    private static final Map<String, Map<Integer, MaxBidInfo>> lastMaxBids = new ConcurrentHashMap<>();

    private void saveLastMaxBids(String roomID, Map<Integer, MaxBidInfo> bids) {
        if (bids == null) {
            return;
        }
        lastMaxBids.putIfAbsent(roomID, new ConcurrentHashMap<>());
        Map<Integer, MaxBidInfo> last = lastMaxBids.get(roomID);
        for (Map.Entry<Integer, MaxBidInfo> entry : bids.entrySet()) {
            last.put(entry.getKey(), entry.getValue());
        }
    }

    private MaxBidInfo getLastMaxBid(String roomID, int auctionIndex) {
        Map<Integer, MaxBidInfo> last = lastMaxBids.get(roomID);
        if (last != null) {
            return last.get(auctionIndex);
        }
        return null;
    }

    private void startAuctionTimer(String roomID) {
        if (roomTimers.containsKey(roomID)) {
            return;
        }
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

                    updateAuctionsAfterTimer(roomID);
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

    private void updateAuctionsAfterTimer(String roomID) {
        AuctionDAO ad = new AuctionDAO();
        List<Auction> list = ad.getByID(roomID);
        Map<Integer, MaxBidInfo> bids = roomAuctionBids.getOrDefault(roomID, Collections.emptyMap());
        Set<Integer> hidden = hiddenAuctions.computeIfAbsent(roomID, k -> ConcurrentHashMap.newKeySet());
        for (Auction a : list) {
            int auctionIndex = Integer.parseInt(a.getID());
            if (hidden.contains(auctionIndex)) {
                continue; // Đã ẩn thì bỏ qua
            }
            MaxBidInfo maxBid = bids.get(auctionIndex);
            if (maxBid != null) {
                // Có người bid trong phiên này
                ad.updateAuctionPrice(auctionIndex, maxBid.amount);
                broadcastAuctionResult(roomID, auctionIndex, maxBid);

            } else {
                MaxBidInfo lastBid = getLastMaxBid(roomID, auctionIndex); 
                if (lastBid != null) {
                    broadcastAuctionResult(roomID, auctionIndex, lastBid);
                }
                hidden.add(auctionIndex);
                broadcastHideAuction(roomID, auctionIndex);
            }
        }
        saveLastMaxBids(roomID, bids);
        roomAuctionBids.put(roomID, new ConcurrentHashMap<>());
    }

    private void broadcastAuctionResult(String roomID, int auctionIndex, MaxBidInfo maxBid) {
        synchronized (roomMap) {
            Set<Session> sessions = roomMap.get(roomID);
            if (sessions != null) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
                        try {
                            session.getBasicRemote().sendText(
                                    String.format(
                                            "{\"Type\":\"BidResult\",\"AuctionIndex\":%d,\"UserID\":\"%s\",\"Username\":\"%s\",\"Amount\":%d}",
                                            auctionIndex, maxBid.userID, maxBid.username, maxBid.amount
                                    )
                            );
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }

    private void broadcastHideAuction(String roomID, int auctionIndex) {
        synchronized (roomMap) {
            Set<Session> sessions = roomMap.get(roomID);
            if (sessions != null) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
                        try {
                            session.getBasicRemote().sendText("{\"Type\":\"HideAuction\",\"Message\":" + auctionIndex + "}");
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
            // Parse bid: #bid-01-20000
            String[] parts = message.split("-");
            if (parts.length == 3) {
                int auctionIndex = Integer.parseInt(parts[1]);
                int bidAmount = Integer.parseInt(parts[2]);
                // Lấy startPrice từ DB hoặc cache (giả sử bạn có hàm getStartPrice)
                AuctionDAO ad = new AuctionDAO();
                List<Auction> list = ad.getByID(ID);
                int startPrice = 0;
                for (Auction a : list) {
                    if (Integer.parseInt(a.getID()) == auctionIndex) {
                        startPrice = a.getStartPrice();
                    }
                }

                if (bidAmount >= startPrice) {
                    roomAuctionBids.putIfAbsent(ID, new ConcurrentHashMap<>());
                    MaxBidInfo current = roomAuctionBids.get(ID).get(auctionIndex);
                    if (current == null || bidAmount > current.amount) {
                        roomAuctionBids.get(ID).put(auctionIndex, new MaxBidInfo(UserID, Username, bidAmount));
                    }

//                    if (hiddenAuctions.containsKey(ID)) {
//                        hiddenAuctions.get(ID).remove(auctionIndex);
//                    }
                }
            }
        } else {
            Type = "Chat";
        }

        if (ID == null) {
            return;
        }
        LiveDAO ld = new LiveDAO();
        LiveChatMessage l = new LiveChatMessage(UserID, Username, Type, message);
        System.out.println("obj:" + l.toString());
        System.out.println("postID" + ID);
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
                        if (timer != null) {
                            timer.cancel();
                        }
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
