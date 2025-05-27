
package model;

import java.util.List;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import java.util.List;

import java.util.List;

public class User {
    private int ID;
    private String avatarURL;
    private String username;
    private String fullname;
    private String gender;
    private Timestamp dob;
    private String email;
    private List<SocialLink> social;
    private String location;
    private String description;
    private LocalDateTime createdAt;
    private String status;
	private String role;

    public User(int ID, String avatarURL, String username, String fullname, String gender, Timestamp dob, String email, List<SocialLink> social, String location, String description) {
        this.ID = ID;
        this.avatarURL = avatarURL;
        this.username = username;
        this.fullname = fullname;
        this.gender = gender;
        this.dob = dob;
        this.email = email;
        this.social = social;
        this.location = location;
        this.description = description;
    }

    public User(int ID, String avatarURL, String username, String fullname, String gender, Timestamp dob, String email, String location, String description, LocalDateTime createdAt, String status, String role) {
        this.ID = ID;
        this.avatarURL = avatarURL;
        this.username = username;
        this.fullname = fullname;
        this.gender = gender;
        this.dob = dob;
        this.email = email;
        this.location = location;
        this.description = description;
        this.createdAt = createdAt;
        this.status = status;
        this.role = role;
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

    public String getAvatarURL() {
        return avatarURL;
    }

    public String getFullname() {
        return fullname;
    }

    public String getGender() {
        return gender;
    }

    public Timestamp getDob() {
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

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setDob(Timestamp dob) {
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


	
