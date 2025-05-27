/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author ADMIN
 */
public class Post {
    private int userID;
    private String title;
    private String content;
    private String mediaURL;
    private String visibility;

    public Post() {
    }

    public Post(int userID, String title, String content, String mediaURL, String visibility) {
        this.userID = userID;
        this.title = title;
        this.content = content;
        this.mediaURL = mediaURL;
        this.visibility = visibility;
    }

    public Post(int userID, String title, String content, String visibility) {
        this.userID = userID;
        this.title = title;
        this.content = content;
        this.visibility = visibility;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMediaURL() {
        return mediaURL;
    }

    public void setMediaURL(String mediaURL) {
        this.mediaURL = mediaURL;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }
    
}
