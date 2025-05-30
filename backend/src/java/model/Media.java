/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author ADMIN
 */
public class Media {

    private int ID;
    private String URL;

    public Media(int ID, String URL) {
        this.ID = ID;
        this.URL = URL;
    }

    public int getID() {
        return ID;
    }

    public String getURL() {
        return URL;
    }

}
