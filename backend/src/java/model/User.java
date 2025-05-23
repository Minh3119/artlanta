package model;

import java.time.LocalDateTime;

public class User {
	private int id;
	private String username;
	private String email;
	private LocalDateTime createdAt;
	private String displayName;
	private String bio;
	private String avatarUrl;
	private String status;
	private String role;

	public User(int id, String username, String email, LocalDateTime createdAt, String displayName, String bio, String avatarUrl, String status, String role) {
		this.id = id;
		this.username = username;
		this.email = email;
		this.createdAt = createdAt;
		this.displayName = displayName;
		this.bio = bio;
		this.avatarUrl = avatarUrl;
		this.status = status;
		this.role = role;
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

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public String getDisplayName() {
		return displayName;
	}

	public String getBio() {
		return bio;
	}

	public String getAvatarUrl() {
		return avatarUrl;
	}

	public String getStatus() {
		return status;
	}

	public String getRole() {
		return role;
	}
	
}
