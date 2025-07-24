package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Auction;
import model.LiveChatMessage;

/**
 *
 * @author ADMIN
 */
public class AuctionDAO extends DBContext {

    public List<Auction> getByID(String postID) {
        List<Auction> list = new ArrayList<>();
        String sql = """
        SELECT * from Auctions
        WHERE LivePostID = ?
    """;

        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, Integer.parseInt(postID));
            ResultSet rs = st.executeQuery();

            while (rs.next()) {
                int SalerID = rs.getInt("SalerID");
                String ID = String.valueOf(rs.getInt("ID"));
                int UserID = rs.getInt("UserID");
                String ImageURL = rs.getString("ImageUrl");
                int StartPrice = rs.getInt("Price");
                String IsBid = rs.getString("IsBid");

                list.add(new Auction(SalerID, ID, ImageURL, StartPrice, UserID, IsBid));
            }

            rs.close();
            st.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    public Auction getByIndex(int ID) {
        String sql = """
        SELECT * from Auctions
        WHERE ID = ?
    """;

        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, ID);
            ResultSet rs = st.executeQuery();

            if (rs.next()) {
                int SalerID = rs.getInt("SalerID");
                int UserID = rs.getInt("UserID");
                String ImageURL = rs.getString("ImageUrl");
                int StartPrice = rs.getInt("Price");
                String IsBid = rs.getString("IsBid");
                rs.close();
                st.close();
                return (new Auction(SalerID, String.valueOf(ID), ImageURL, StartPrice, UserID, IsBid));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public void insertAuctionList(int userID, int livePostID, List<Auction> list) {
        String sqlAuction = """
        INSERT INTO Auctions (SalerID, LivePostID, ImageUrl, Price, UserID, IsBid)
        VALUES (?, ?, ?, ?, ?, ?);
    """;

        PreparedStatement stAuction = null;

        try {
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
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (stAuction != null && !stAuction.isClosed()) {
                    stAuction.close();
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
        }

    }

    public void updateAuctionPrice(int ID, int newPrice, int UserID) {
        String sql = """
                   update Auctions
                   set Price=?, UserID=?
                   where ID=?;
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, newPrice);
            st.setInt(2, UserID);
            st.setInt(3, ID);
            st.executeUpdate();
            st.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public void updateAuctionBidStatus(String status, int ID) {
        String sql = """
                   update Auctions
                   set IsBid=?
                   where ID=?;
                   """;
        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setString(1, status);
            st.setInt(2, ID);
            st.executeUpdate();
            st.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
