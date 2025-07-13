package model;

import java.sql.Timestamp;

public class Conversation {
    private int id;
    private int user1Id;
    private int user2Id;
    private Timestamp createdAt;

    // Constructors
    public Conversation() {
    }


    public Conversation(int id, int user1Id, int user2Id, Timestamp createdAt) {
        this.id = id;
        this.user1Id = user1Id;
        this.user2Id = user2Id;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public int getUser1Id() {
        return user1Id;
    }

    public void setUser1Id(int user1Id) {
        this.user1Id = user1Id;
    }


    public int getUser2Id() {
        return user2Id;
    }

    public void setUser2Id(int user2Id) {
        this.user2Id = user2Id;
    }


    public Timestamp getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }


    @Override
    public String toString() {
        return "Conversation{" +
                "id=" + id +
                ", user1Id=" + user1Id +
                ", user2Id=" + user2Id +
                ", createdAt=" + createdAt +
                '}';
    }
}
