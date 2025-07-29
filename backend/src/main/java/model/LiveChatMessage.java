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
public class LiveChatMessage {
    private String UserID;
    private String Username;
    private String Avatar;
    private String Type;
    private String Message;
    private LocalDateTime createdAt;

    public LiveChatMessage(String UserID, String Username, String Avatar, String Type, String Message, LocalDateTime createdAt) {
        this.UserID = UserID;
        this.Username = Username;
        this.Avatar = Avatar;
        this.Type = Type;
        this.Message = Message;
        this.createdAt = createdAt;
    }

    
    public LiveChatMessage(String UserID, String Username, String Avatar, String Type, String Message) {
        this.UserID = UserID;
        this.Username = Username;
        this.Avatar = Avatar;
        this.Type = Type;
        this.Message = Message;
    }

    public LiveChatMessage(String Username, String Message) {
        this.Username = Username;
        this.Message = Message;
    }

    public String getAvatar() {
        return Avatar;
    }

    

    public String getUserID() {
        return UserID;
    }

    public String getType() {
        return Type;
    }

    

    public String getUsername() {
        return Username;
    }

    public String getMessage() {
        return Message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
}
