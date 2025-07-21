package dto;

import java.time.LocalDateTime;

public class CommissionDTO {
    private int commissionId;
    private int requestId;
    private String title;
    private String description;
    private double price;
    private LocalDateTime deadline;
    private String fileDeliveryURL;
    private String status;
    private boolean artistSeenFinal;
    private boolean clientConfirmed;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String previewImageURL;

    // CommissionRequest fields
    private int clientId;
    private int artistId;
    private String shortDescription;
    private String referenceURL;
    private Double proposedPrice;
    private LocalDateTime proposedDeadline;
    private String requestStatus;
    private String artistReply;
    private LocalDateTime requestAt;
    private LocalDateTime respondedAt;

    // Optionally, add client/artist username/avatar if needed
    private String clientUsername;
    private String artistUsername;
    private String clientAvatarURL;
    private String artistAvatarURL;

    public CommissionDTO() {}

    // Getters and setters for all fields
    public int getCommissionId() { return commissionId; }
    public void setCommissionId(int commissionId) { this.commissionId = commissionId; }
    public int getRequestId() { return requestId; }
    public void setRequestId(int requestId) { this.requestId = requestId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public String getFileDeliveryURL() { return fileDeliveryURL; }
    public void setFileDeliveryURL(String fileDeliveryURL) { this.fileDeliveryURL = fileDeliveryURL; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public boolean isArtistSeenFinal() { return artistSeenFinal; }
    public void setArtistSeenFinal(boolean artistSeenFinal) { this.artistSeenFinal = artistSeenFinal; }
    public boolean isClientConfirmed() { return clientConfirmed; }
    public void setClientConfirmed(boolean clientConfirmed) { this.clientConfirmed = clientConfirmed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public int getClientId() { return clientId; }
    public void setClientId(int clientId) { this.clientId = clientId; }
    public int getArtistId() { return artistId; }
    public void setArtistId(int artistId) { this.artistId = artistId; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getReferenceURL() { return referenceURL; }
    public void setReferenceURL(String referenceURL) { this.referenceURL = referenceURL; }
    public Double getProposedPrice() { return proposedPrice; }
    public void setProposedPrice(Double proposedPrice) { this.proposedPrice = proposedPrice; }
    public LocalDateTime getProposedDeadline() { return proposedDeadline; }
    public void setProposedDeadline(LocalDateTime proposedDeadline) { this.proposedDeadline = proposedDeadline; }
    public String getRequestStatus() { return requestStatus; }
    public void setRequestStatus(String requestStatus) { this.requestStatus = requestStatus; }
    public String getArtistReply() { return artistReply; }
    public void setArtistReply(String artistReply) { this.artistReply = artistReply; }
    public LocalDateTime getRequestAt() { return requestAt; }
    public void setRequestAt(LocalDateTime requestAt) { this.requestAt = requestAt; }
    public LocalDateTime getRespondedAt() { return respondedAt; }
    public void setRespondedAt(LocalDateTime respondedAt) { this.respondedAt = respondedAt; }
    public String getClientUsername() { return clientUsername; }
    public void setClientUsername(String clientUsername) { this.clientUsername = clientUsername; }
    public String getArtistUsername() { return artistUsername; }
    public void setArtistUsername(String artistUsername) { this.artistUsername = artistUsername; }
    public String getClientAvatarURL() { return clientAvatarURL; }
    public void setClientAvatarURL(String clientAvatarURL) { this.clientAvatarURL = clientAvatarURL; }
    public String getArtistAvatarURL() { return artistAvatarURL; }
    public void setArtistAvatarURL(String artistAvatarURL) { this.artistAvatarURL = artistAvatarURL; }
    public String getPreviewImageURL() { return previewImageURL; }
    public void setPreviewImageURL(String previewImageURL) { this.previewImageURL = previewImageURL; }
} 