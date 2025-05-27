package model;

import java.time.LocalDateTime;

public class User {
	private int id;
	private String username;
	private String email;
	private String passwordHash;
	private String fullName;
	private String bio;
	private String avatarUrl;
	private boolean gender;
//	private LocalDateTime dob;
	private String location;
	private String role;
	private String status;
	private String language;
	private LocalDateTime createdAt;
	private LocalDateTime lastLogin;
	private boolean isPrivate;

	public User(int id, String username, String email, String passwordHash, String fullName, String bio, 
			String avatarUrl, boolean gender, String location, String role, 
			String status, String language, LocalDateTime createdAt, LocalDateTime lastLogin, boolean isPrivate) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.passwordHash = passwordHash;
		this.fullName = fullName;
		this.bio = bio;
		this.avatarUrl = avatarUrl;
		this.gender = gender;
//		this.dob = dob;
		this.location = location;
		this.role = role;
		this.status = status;
		this.language = language;
		this.createdAt = createdAt;
		this.lastLogin = lastLogin;
		this.isPrivate = isPrivate;
	}

	public int getId() {
		return id;
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

	public String getAvatarUrl() {
		return avatarUrl;
	}

	public boolean isGender() {
		return gender;
	}

//	public LocalDateTime getDob() {
//		return dob;
//	}

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

	public boolean isPrivate() {
		return isPrivate;
	}
}
