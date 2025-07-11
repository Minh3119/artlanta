/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.time.LocalDateTime;

/**
 *
 * @author ADMIN
 */
public class Live {
    private int ID;
    private int userID;
    private String userName;
    private String avatar;
    private String title;
    private String LiveID;
    private int view;
    private LocalDateTime createdAt;
    private String LiveStatus;
    private String visibility;

    public Live() {
    }

    public Live(int ID, int userID, String userName, String avatar, String title, String LiveID, int view, LocalDateTime createdAt, String LiveStatus, String visibility) {
        this.ID = ID;
        this.userID = userID;
        this.userName = userName;
        this.avatar = avatar;
        this.title = title;
        this.LiveID = LiveID;
        this.view = view;
        this.createdAt = createdAt;
        this.LiveStatus = LiveStatus;
        this.visibility = visibility;
    }
    
    

    public int getID() {
        return ID;
    }

    public int getUserID() {
        return userID;
    }

    public String getUserName() {
        return userName;
    }

    public String getAvatar() {
        return avatar;
    }

    public String getTitle() {
        return title;
    }

    public int getView() {
        return view;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getLiveStatus() {
        return LiveStatus;
    }

    public String getVisibility() {
        return visibility;
    }
    
    
    
    
}
