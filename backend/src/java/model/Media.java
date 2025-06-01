/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.sql.Timestamp;

/**
 *
 * @author ADMIN
 */
public class Media {

    private int ID;
    private String URL;
    private String Description;
    private Timestamp CreatedAt;

    public Media() {
    }

    public Media(int ID, String URL, String Description, Timestamp CreatedAt) {
        this.ID = ID;
        this.URL = URL;
        this.Description = Description;
        this.CreatedAt = CreatedAt;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getURL() {
        return URL;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String Description) {
        this.Description = Description;
    }

    public Timestamp getCreatedAt() {
        return CreatedAt;
    }

    public void setCreatedAt(Timestamp CreatedAt) {
        this.CreatedAt = CreatedAt;
    }

}
