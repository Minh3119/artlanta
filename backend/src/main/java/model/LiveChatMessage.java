/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author ADMIN
 */
public class LiveChatMessage {
    private String Username;
    private String Message;

    public LiveChatMessage(String Username, String Message) {
        this.Username = Username;
        this.Message = Message;
    }

    public String getUsername() {
        return Username;
    }

    public String getMessage() {
        return Message;
    }
    
}
