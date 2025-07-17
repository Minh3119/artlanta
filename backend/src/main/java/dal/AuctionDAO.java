/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import model.Auction;
import model.LiveChatMessage;

/**
 *
 * @author ADMIN
 */
public class AuctionDAO extends DBContext{
    public List<Auction> getByID(String postID){
        List<Auction> list=new ArrayList<>();
        String sql = """
        SELECT * from Auctions
        WHERE LivePostID = ?
    """;

        try {
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, Integer.parseInt(postID));
            ResultSet rs = st.executeQuery();

            while (rs.next()) {
                String ID = String.valueOf(rs.getInt("ID"));
                String ImageURL = rs.getString("ImageUrl");
                int StartPrice = rs.getInt("StartPrice");


                list.add(new Auction(ID,ImageURL,StartPrice));
            }

            rs.close();
            st.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }
    public void updateAuctionPrice( int ID, int newPrice){
        String sql="""
                   update Auctions
                   set StartPrice=?
                   where ID=?;
                   """;
        try{
            PreparedStatement st= connection.prepareStatement(sql);
            st.setInt(1, newPrice);
            st.setInt(2, ID);
            st.executeUpdate();
            st.close();
        }
        catch(Exception e){
            e.printStackTrace();
        }
        
    }
}
