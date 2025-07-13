package model;

import java.time.LocalDateTime;

public class CommissionRequest {
    private int ID;
    private int clientID;
    private int artistID;
    private String title;
    private String description;
    private String referenceURL;
    private LocalDateTime requestAt;
    private String status;      // PENDING or APPROVED or REJECTED

    public CommissionRequest(int ID, int clientID, int artistID, String title, String description, 
                           String referenceURL, LocalDateTime requestAt, String status) {
        this.ID = ID;
        this.clientID = clientID;
        this.artistID = artistID;
        this.title = title;
        this.description = description;
        this.referenceURL = referenceURL;
        this.requestAt = requestAt;
        this.status = status;
    }

    public int getID() {
        return ID;
    }

    public int getClientID() {
        return clientID;
    }

    public int getArtistID() {
        return artistID;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getReferenceURL() {
        return referenceURL;
    }

    public LocalDateTime getRequestAt() {
        return requestAt;
    }

    public String getStatus() {
        return status;
    }

} 