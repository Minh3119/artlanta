/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.util.List;

/**
 *
 * @author ADMIN
 */
public class User {
    private int ID;
    private String logo;
    private String username;
    private String fullname;
    private int gender;
    private String dob;
    private String email;
    private List<SocialLink> social;
    private String location;
    private String description;

    public User(int ID, String logo, String username, String fullname, int gender, String dob, String email, List<SocialLink> social, String location, String description) {
        this.ID = ID;
        this.logo = logo;
        this.username = username;
        this.fullname = fullname;
        this.gender = gender;
        this.dob = dob;
        this.email = email;
        this.social = social;
        this.location = location;
        this.description = description;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getLogo() {
        return logo;
    }

    public String getFullname() {
        return fullname;
    }

    public int getGender() {
        return gender;
    }

    public String getDob() {
        return dob;
    }

    public String getEmail() {
        return email;
    }

    public List<SocialLink> getSocial() {
        return social;
    }

    public String getLocation() {
        return location;
    }

    public String getDescription() {
        return description;
    }

    public User() {
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public void setGender(int gender) {
        this.gender = gender;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSocial(List<SocialLink> social) {
        this.social = social;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
