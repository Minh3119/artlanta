package model;

import java.time.LocalDateTime;

public class User {

    private int ID;
    private String username;
    private String email;
    private String passwordHash;
    private String fullName;
    private String bio;
    private String avatarURL;
    private boolean gender;
    private LocalDateTime DOB;
    private String location;
    private String role;
    private String status;
    private String language;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private boolean isFlagged;
    
    public User(int ID, String username, String email, String passwordHash, String fullName, String bio,
            String avatarURL, boolean gender, LocalDateTime DOB, String location, String role, String status,
            String language, LocalDateTime createdAt, LocalDateTime lastLogin, boolean isFlagged) {
        this.ID = ID;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.bio = bio;
        this.avatarURL = avatarURL;
        this.gender = gender;
        this.DOB = DOB;
        this.location = location;
        this.role = role;
        this.status = status;
        this.language = language;
        this.createdAt = createdAt;
        this.lastLogin = lastLogin;
        this.isFlagged = isFlagged;
    }

    public int getID() {
        return ID;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getFullName() {
        return fullName;
    }

    public String getBio() {
        return bio;
    }

    public String getAvatarURL() {
        return avatarURL;
    }

    public boolean getGender() {
        return gender;
    }

    public LocalDateTime getDOB() {
        return DOB;
    }

    public String getLocation() {
        return location;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    public String getLanguage() {
        return language;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setAvatarURL(String avatarURL) {
        this.avatarURL = avatarURL;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public void setDOB(LocalDateTime dOB) {
        DOB = dOB;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public void setFlagged(boolean isFlagged) {
        this.isFlagged = isFlagged;
    }

}
