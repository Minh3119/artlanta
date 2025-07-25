package controller.Live;

import controller.messaging.HttpSessionConfigurator;
import dal.AuctionDAO;
import dal.LiveDAO;
import dal.NotificationDAO;
import dal.UserDAO;
import dal.WalletDAO;

import jakarta.servlet.http.HttpSession;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.math.BigDecimal;
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
import java.util.logging.Level;
import java.util.logging.Logger;
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
    private static final Map<String, Integer> roomCurrentAuction = new ConcurrentHashMap<>();
    public static final Map<String, Set<Integer>> newAuctionsMap = new ConcurrentHashMap<>();
    private static final Map<String, Map<Integer, MaxBidInfo>> roomAuctionBids = new ConcurrentHashMap<>();
    private static final int AUCTION_TIME = 50;

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

                    updateAuctionsAfterTimer(roomID);

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

    private void updateAuctionsAfterTimer(String roomID) {
        AuctionDAO ad = new AuctionDAO();
        List<Auction> list = ad.getByID(roomID);
        int currentIndex = roomCurrentAuction.getOrDefault(roomID, -1);
        Map<Integer, MaxBidInfo> bids = roomAuctionBids.getOrDefault(roomID, Collections.emptyMap());
        Set<Integer> newAuctions = newAuctionsMap.getOrDefault(roomID, Collections.emptySet());
        int count = 0;
        for (Auction a : list) {
            int auctionIndex = Integer.parseInt(a.getID());
//            System.out.println("current: " + currentIndex);
//            System.out.println("count: " + count);
            if (count != currentIndex) {
                count++;
                continue;
            }
            if (a.getIsBid().equals("Bid")) {
                count++;
                continue;
            }
            MaxBidInfo maxBid = bids.get(auctionIndex);
            if (maxBid != null) {

                ad.updateAuctionPrice(auctionIndex, maxBid.amount, maxBid.userID);
                broadcastAuctionTransaction(roomID, auctionIndex);
                System.out.println("dachay");

            } else {
                if (newAuctions.contains(auctionIndex)) {
                    broadcastReloadCommand(roomID);
                    newAuctions.remove(auctionIndex);
                    continue;
                }
                ad.updateAuctionBidStatus("Bid", auctionIndex);
                broadcastAuctionResult(roomID, auctionIndex);
                System.out.println("thanhcong");
            }
            count++;
        }
        roomAuctionBids.put(roomID, new ConcurrentHashMap<>());
    }
    private void broadcastReloadCommand(String roomID){
        synchronized (roomMap) {
            Set<Session> sessions = roomMap.get(roomID);
            if (sessions != null) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
                        try {
                            session.getBasicRemote().sendText(
                                    String.format(
                                            "{\"Type\":\"Reload\",\"Reload\":\"%s\"}","true"
                                            
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
    private void broadcastAuctionResult(String roomID, int auctionIndex) {
        AuctionDAO ad = new AuctionDAO();
        Auction au = ad.getByIndex(auctionIndex);
        List<Auction> list = ad.getByID(roomID);
        NotificationDAO nd = new NotificationDAO();
        boolean rs = nd.saveNotification(au.getUserID(), "Auction", au.getImageUrl());

        roomCurrentAuction.computeIfPresent(roomID, (key, index) -> index + 1);

        int currentIndex = roomCurrentAuction.getOrDefault(roomID, -1);
        System.out.println("current aution " + currentIndex);
        WalletDAO wd = new WalletDAO();
        wd.addBalance(au.getSalerID(), BigDecimal.valueOf(au.getStartPrice()));
        wd.updateRemoveBalance(au.getUserID(), BigDecimal.valueOf(au.getStartPrice()));
        synchronized (roomMap) {
            Set<Session> sessions = roomMap.get(roomID);
            if (sessions != null) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
                        try {
                            session.getBasicRemote().sendText(
                                    String.format(
                                            "{\"Type\":\"BidResult\",\"AuctionIndex\":%d,\"UserID\":\"%s\",\"Amount\":%d,\"ImageURL\":\"%s\",\"IsBid\":\"%s\",\"CurrentAuction\":%d}",
                                            auctionIndex, au.getUserID(), au.getStartPrice(), au.getImageUrl(), au.getIsBid(), currentIndex
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

    private void broadcastAuctionTransaction(String roomID, int auctionIndex) {
        AuctionDAO ad = new AuctionDAO();
        Auction au = ad.getByIndex(auctionIndex);
        synchronized (roomMap) {
            Set<Session> sessions = roomMap.get(roomID);
            if (sessions != null) {
                for (Session session : sessions) {
                    if (session.isOpen()) {
                        try {
                            session.getBasicRemote().sendText(
                                    String.format(
                                            "{\"Type\":\"BidUpdate\",\"AuctionIndex\":%d,\"UserID\":\"%s\",\"Amount\":%d,\"ImageURL\":\"%s\"}",
                                            auctionIndex, au.getUserID(), au.getStartPrice(), au.getImageUrl()
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

    public void handleBid(String message, String ID, String UserID) {
        String[] parts = message.split("-");
        if (parts.length == 3) {
            int auctionIndex = Integer.parseInt(parts[1]);
            System.out.println("AuID:" + auctionIndex);
            int bidAmount = Integer.parseInt(parts[2]);
            int currentAuction = roomCurrentAuction.getOrDefault(ID, -1);

            AuctionDAO ad = new AuctionDAO();
            List<Auction> list = ad.getByID(ID);
            int count = 0;
            for (Auction a : list) {
                if (count != currentAuction) {
                    //sai id cua transaction
                    count++;
                    continue;
                }
                count++;
                if (Integer.parseInt(a.getID()) == auctionIndex && a.getIsBid().equals("NoBid")) {
                    int startPrice = a.getStartPrice();
                    if (bidAmount >= startPrice) {
                        roomAuctionBids.putIfAbsent(ID, new ConcurrentHashMap<>());
                        MaxBidInfo current = roomAuctionBids.get(ID).get(auctionIndex);
                        if (current == null || bidAmount > current.amount) {
                            roomAuctionBids.get(ID).put(auctionIndex, new MaxBidInfo(Integer.parseInt(UserID), bidAmount));
                        }

                    }
                }
            }

        }
    }

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        String ID = getLiveID(session);
        LiveDAO ld = new LiveDAO();
        UserDAO ud = new UserDAO();
        boolean isLive = ld.isLiveByID(ID);

        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        String Username = "Anonymous";
        String UserID = "0";

        if (httpSession != null && httpSession.getAttribute("user") != null) {
            Username = String.valueOf(httpSession.getAttribute("user"));
            UserID = String.valueOf(httpSession.getAttribute("userId"));
        }
        String Avatar = ud.getOne(Integer.parseInt(UserID)).getAvatarURL();
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
            if (!isLive) {
                int view = ld.incrementViewForPost(Integer.parseInt(ID));

                for (Session s : roomMap.get(ID)) {
                    try {
                        s.getBasicRemote().sendText(
                                String.format("{\"Type\":\"View\",\"View\":%d}", view)
                        );
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            } else {
                ld = new LiveDAO();
                ld.updateView(Integer.parseInt(ID), roomMap.get(ID).size());
                for (Session s : roomMap.get(ID)) {
                    try {
                        s.getBasicRemote().sendText(
                                String.format(
                                        "{\"Type\":\"View\",\"View\":%d}",
                                        roomMap.get(ID).size()
                                )
                        );
                    } catch (IOException ex) {
                        Logger.getLogger(LiveChatEndpoint.class.getName()).log(Level.SEVERE, null, ex);
                    }
                }
            }
        }

        session.getUserProperties().put("ID", ID);
        session.getUserProperties().put("UserID", UserID);
        session.getUserProperties().put("Username", Username);
        session.getUserProperties().put("Avatar", Avatar);
        session.getUserProperties().put("isLive", isLive);

        if (isLive) {
            roomCurrentAuction.putIfAbsent(ID, 0);

            try {
                session.getBasicRemote().sendText(
                        String.format(
                                "{\"Type\":\"CurrentAuction\",\"CurrentAuction\":%d}",
                                roomCurrentAuction.getOrDefault(ID, 0)
                        )
                );
            } catch (IOException e) {
                e.printStackTrace();
            }
            startAuctionTimer(ID);

        }

    }

    @OnMessage
    public void onMessage(String message, Session senderSession) throws IOException, EncodeException {
        String ID = String.valueOf(senderSession.getUserProperties().get("ID"));
        String UserID = String.valueOf(senderSession.getUserProperties().get("UserID"));
        String Username = String.valueOf(senderSession.getUserProperties().get("Username"));
        String Avatar = String.valueOf(senderSession.getUserProperties().get("Avatar"));
        boolean isLive = Boolean.TRUE.equals(senderSession.getUserProperties().get("isLive"));
        String Type = "Chat";
        if (isLive) {
            if (message.startsWith("#bid")) {
                Type = "Bid";
                //  bid: #bid-01-20000
                handleBid(message, ID, UserID);

            } else if (message.startsWith("at-")) {
                Type = "at";
                String[] parts = message.split("-");

                roomCurrentAuction.put(ID, Integer.parseInt(parts[1]));
            } else {
                Type = "Chat";
            }
        } else if (message.startsWith("at-")) {
            Type = "at";
            String[] parts = message.split("-");

            roomCurrentAuction.put(ID, Integer.parseInt(parts[1]));

        }

        if (ID == null) {
            return;
        }
        LiveDAO ld = new LiveDAO();
        if (!Type.equals("at")) {
            ld.insertLiveMessage(new LiveChatMessage(UserID, Username, Avatar, Type, message), ID);
        }
        synchronized (roomMap) {
            Set<Session> sessionsInRoom = roomMap.get(ID);
            if (sessionsInRoom != null) {
                for (Session session : sessionsInRoom) {
                    if (session.isOpen()) {
                        if (!Type.equals("at")) {
                            session.getBasicRemote().sendObject(new LiveChatMessage(UserID, Username, Avatar, Type, message));
                        }

                    }
                }
            }
        }
    }

    @OnClose
    public void onClose(Session session) {
        String ID = String.valueOf(session.getUserProperties().get("ID"));
        boolean isLive = Boolean.TRUE.equals(session.getUserProperties().get("isLive"));
        if (ID != null) {
            synchronized (roomMap) {
                Set<Session> sessions = roomMap.get(ID);
                if (sessions != null) {
                    sessions.remove(session);

                    if (isLive) {
                        LiveDAO ld = new LiveDAO();
                        ld.updateView(Integer.parseInt(ID), sessions.size());
                        for (Session s : sessions) {
                            try {
                                s.getBasicRemote().sendText(
                                        String.format(
                                                "{\"Type\":\"View\",\"View\":%d}",
                                                sessions.size()
                                        )
                                );
                            } catch (IOException ex) {
                                Logger.getLogger(LiveChatEndpoint.class.getName()).log(Level.SEVERE, null, ex);
                            }
                        }
                    }
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
//        System.err.println("WebSocket error: " + throwable.getMessage());
        throwable.printStackTrace();
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
