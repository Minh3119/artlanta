package model;

import java.time.LocalDateTime;

public class Commission {
    private int ID;
    private int requestID;
    private String title;
    private String description;
    private double price;
    private LocalDateTime deadline;
    private String fileDeliveryURL;
    private String status; // IN_PROGRESS, COMPLETED, CANCELLED
    private boolean artistSeenFinal;
    private boolean clientConfirmed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Commission(int ID, int requestID, String title, String description, double price, LocalDateTime deadline, String fileDeliveryURL, String status, boolean artistSeenFinal, boolean clientConfirmed, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.ID = ID;
        this.requestID = requestID;
        this.title = title;
        this.description = description;
        this.price = price;
        this.deadline = deadline;
        this.fileDeliveryURL = fileDeliveryURL;
        this.status = status;
        this.artistSeenFinal = artistSeenFinal;
        this.clientConfirmed = clientConfirmed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public int getID() { return ID; }
    public int getRequestID() { return requestID; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public double getPrice() { return price; }
    public LocalDateTime getDeadline() { return deadline; }
    public String getFileDeliveryURL() { return fileDeliveryURL; }
    public String getStatus() { return status; }
    public boolean isArtistSeenFinal() { return artistSeenFinal; }
    public boolean isClientConfirmed() { return clientConfirmed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
} 