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

    public Media() {
    }

    public Media(int ID, String URL, String Description) {
        this.ID = ID;
        this.URL = URL;
        this.Description = Description;
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

<<<<<<< HEAD
=======

>>>>>>> 8c75e2ef05496b82164cd6e26cbf6a64fe165d73
}
