/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Auction;
import model.Live;
import model.LiveChatMessage;

/**
 *
 * @author ADMIN
 */
public class LiveDAO extends DBContext {

    public List<Live> getAll() {
        List<Live> list = new ArrayList<>();
        try {
            PreparedStatement st = connection.prepareStatement("Select lp.ID,lp.UserID,u.Username,u.AvatarURL,lp.Title, lp.LiveID, lp.LiveView,lp.CreatedAt,lp.LiveStatus,lp.Visibility from LivePosts as lp join Users as u on lp.UserID=u.ID order by lp.CreatedAt DESC;");
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                list.add(new Live(rs.getInt("ID"), rs.getInt("UserID"), rs.getString("Username"), rs.getString("AvatarURL"), rs.getString("Title"), rs.getString("LiveID"), rs.getInt("LiveView"), rs.getTimestamp("CreatedAt").toLocalDateTime(), rs.getString("LiveStatus"), rs.getString("Visibility")));
            }
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    public Live getOne(int ID) {
        String sql = """
                   Select lp.ID,lp.UserID,u.Username,u.AvatarURL,lp.Title, lp.LiveID,
                        lp.LiveView,lp.CreatedAt,lp.LiveStatus,lp.Visibility 
                        from LivePosts as lp join Users as u on lp.UserID=u.ID
                        where lp.ID=?;
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, ID);
            ResultSet rs = st.executeQuery();
            if (rs.next()) {
                return (new Live(rs.getInt("ID"), rs.getInt("UserID"), rs.getString("Username"), rs.getString("AvatarURL"), rs.getString("Title"), rs.getString("LiveID"), rs.getInt("LiveView"), rs.getTimestamp("CreatedAt").toLocalDateTime(), rs.getString("LiveStatus"), rs.getString("Visibility")));
            }
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new Live();
    }

//    public List<Auction> getAuction(int ID) {
//        List<Auction> list = new ArrayList<>();
//        String sql = """
//                   Select * from Auctions
//                   where LivePostID=?;
//                   """;
//        try {
//            PreparedStatement st = connection.prepareStatement(sql);
//            st.setInt(1, ID);
//            ResultSet rs = st.executeQuery();
//            while (rs.next()) {
//                String AucID= String.valueOf(rs.getInt("ID"));
//                int UserID = rs.getInt("UserID");
//                String ImageURL = rs.getString("ImageUrl");
//                int StartPrice = rs.getInt("Price");
//                String IsBid = rs.getString("IsBid");
//                list.add(new  Auction());
//            }
//            st.close();
//            rs.close();
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return list;
//    }

    public int insertLive(int userID, String title, String liveID, String visibility, List<Auction> list) {
        int livePostID = 0;
        PreparedStatement stPost = null;
        PreparedStatement stAuction = null;
        ResultSet rs = null;

        try {
            connection.setAutoCommit(false);

            String sqlPost = """
                                INSERT INTO LivePosts(UserID, Title, LiveID, LiveView, LiveStatus, Visibility)
                                VALUES (?, ?, ?, 0, 'Live', ?);
                            """;
            stPost = connection.prepareStatement(sqlPost, Statement.RETURN_GENERATED_KEYS);
            stPost.setInt(1, userID);
            stPost.setString(2, title);
            stPost.setString(3, liveID);
            stPost.setString(4, visibility);
            stPost.executeUpdate();

            rs = stPost.getGeneratedKeys();
            if (rs.next()) {
                livePostID = rs.getInt(1);
            } else {
                throw new SQLException("Failed to retrieve inserted LivePost ID.");
            }

            String sqlAuction = """
                                    INSERT INTO Auctions(SalerID,LivePostID, ImageUrl, Price,UserID,IsBid)
                                    VALUES (?,?, ?, ?,?,?);
                                """;
            stAuction = connection.prepareStatement(sqlAuction);
            for (Auction auction : list) {
                stAuction.setInt(1, userID);
                stAuction.setInt(2, livePostID);
                stAuction.setString(3, auction.getImageUrl());
                stAuction.setInt(4, auction.getStartPrice());
                stAuction.setInt(5, userID);
                stAuction.setString(6, "NoBid");
                stAuction.addBatch();
            }
            stAuction.executeBatch();

            connection.commit();

        } catch (Exception e) {
            e.printStackTrace();
            try {
                connection.rollback();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            livePostID = 0;
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stPost != null) {
                    stPost.close();
                }
                if (stAuction != null) {
                    stAuction.close();
                }
                connection.setAutoCommit(true);
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return livePostID;
    }

    public void updateView(int ID, int View) {
        String sql = """
                   update LivePosts
                   set LiveView= ?
                   where ID=?;
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, View);
            st.setInt(2, ID);
            st.executeUpdate();

            st.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public int incrementViewForPost(int id) {
    String sql = "UPDATE LivePosts SET LiveView = LiveView + 1 WHERE ID = ?";
    String sql2 = "SELECT LiveView FROM LivePosts WHERE ID = ?";
    try (PreparedStatement ps = connection.prepareStatement(sql);
         PreparedStatement ps2 = connection.prepareStatement(sql2)) {
        ps.setInt(1, id);
        ps.executeUpdate();

        ps2.setInt(1, id);
        ResultSet rs = ps2.executeQuery();
        if (rs.next()) {
            return rs.getInt("LiveView");
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
    return 0;
}
    public int getView(int ID) {
        int view=0;
        String sql = """
                   select * from LivePosts
                   where ID=?;
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, ID);
            ResultSet rs= st.executeQuery();
            if(rs.next()){
                view= rs.getInt("LiveView");
            }
            
            st.close();
            rs.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return view;
    }

    public void endLive(int ID, int View) {
        String sql = """
                   update LivePosts
                   set LiveView= ?, LiveStatus='Post'
                   where ID=?;
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, View);
            st.setInt(2, ID);
            st.executeUpdate();

            st.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void insertLiveMessage(LiveChatMessage mess, String postID) {
        String sql = """
                   insert into LiveChatMessages(LivePostID,UserID,ChatType,Message) 
                   values(?,?,?,?)
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, Integer.parseInt(postID));
            st.setInt(2, Integer.parseInt(mess.getUserID()));
            st.setString(3, mess.getType());
            st.setString(4, mess.getMessage());
            st.executeUpdate();

            st.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public List<LiveChatMessage> getLiveChatMessage(String postID) {
        List<LiveChatMessage> list = new ArrayList<>();
        String sql = """
        SELECT lcm.UserID, u.Username, u.AvatarURL,lcm.ChatType, lcm.Message, lcm.CreatedAt
        FROM LiveChatMessages AS lcm
        JOIN Users AS u ON lcm.UserID = u.ID
        WHERE LivePostID = ?
    """;

        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, Integer.parseInt(postID));
            ResultSet rs = st.executeQuery();

            while (rs.next()) {
                String userID = String.valueOf(rs.getInt("UserID"));
                String username = rs.getString("Username");
                String avatar = rs.getString("AvatarURL");
                String chatType = rs.getString("ChatType");
                String message = rs.getString("Message");
                LocalDateTime createdAt = rs.getTimestamp("CreatedAt").toLocalDateTime();

                LiveChatMessage msg = new LiveChatMessage(userID, username, avatar, chatType, message, createdAt);
                list.add(msg);
            }

            rs.close();
            st.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }
    public boolean isLiveByID(String ID){
        String live="Post";
        String sql="""
                   select LiveStatus from LivePosts
                   where ID=?
                   """;
        try{
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, Integer.parseInt(ID));
            ResultSet rs = st.executeQuery();
            if(rs.next()){
                live= rs.getString("LiveStatus");
            }
            st.close();
            rs.close();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        
        return live.equalsIgnoreCase("Live");
    }

}
