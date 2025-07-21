/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author ADMIN
 */
public class Gallery {

    private int ID;
    private int UserID;
    private int LivePostID;
    private String Username;
    private String imageURL;
    private int GalleryLike;

    public Gallery(int ID, int UserID, int LivePostID, String Username, String imageURL, int GalleryLike) {
        this.ID = ID;
        this.UserID = UserID;
        this.LivePostID = LivePostID;
        this.Username = Username;
        this.imageURL = imageURL;
        this.GalleryLike = GalleryLike;
    }

    public String getUsername() {
        return Username;
    }

    public int getID() {
        return ID;
    }

    public int getUserID() {
        return UserID;
    }

    public int getLivePostID() {
        return LivePostID;
    }

    public String getImageURL() {
        return imageURL;
    }

    public int getGalleryLike() {
        return GalleryLike;
    }

}
