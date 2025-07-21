/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import jakarta.servlet.http.Part;

/**
 *
 * @author ADMIN
 */
public class Auction {
    
    private int SalerID;
    private String ID;
    private Part image;
    private String imageUrl;
    private int startPrice;
    private int userID;
    private String isBid;

    public Auction() {
    }

    public Auction(int SalerID,String ID, String imageUrl, int startPrice, int userID, String isBid) {
        this.SalerID=SalerID;
        this.ID = ID;
        this.imageUrl = imageUrl;
        this.startPrice = startPrice;
        this.userID = userID;
        this.isBid = isBid;
    }

    

    public Auction(Part image, int startPrice) {
        this.image = image;
        this.startPrice = startPrice;
    }

    public Auction(Part image, String imageUrl, int startPrice) {
        this.image = image;
        this.imageUrl = imageUrl;
        this.startPrice = startPrice;
    }

    public int getSalerID() {
        return SalerID;
    }

    

    public String getIsBid() {
        return isBid;
    }

    public int getUserID() {
        return userID;
    }

    public String getID() {
        return ID;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Part getImage() {
        return image;
    }

    public int getStartPrice() {
        return startPrice;
    }

}
