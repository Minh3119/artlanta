/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author ADMIN
 */
public class PostMedia {

    private int postID;
    private int mediaID;

    public PostMedia(int postID, int mediaID) {
        this.postID = postID;
        this.mediaID = mediaID;
    }

    public int getPostID() {
        return postID;
    }

    public int getMediaID() {
        return mediaID;
    }

}
