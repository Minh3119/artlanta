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
    private String ID;
    private Part image;
    private String imageUrl;
    private int startPrice;

    public Auction() {
    }
    public Auction(String ID, String imageUrl, int startPrice) {
        this.ID = ID;
        this.imageUrl = imageUrl;
        this.startPrice = startPrice;
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

    public Auction(String imageUrl, int startPrice) {
        this.imageUrl = imageUrl;
        this.startPrice = startPrice;
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
