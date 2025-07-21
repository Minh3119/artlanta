package model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CommissionRequest {
    private int ID;
    private int clientID;
    private int artistID;
    private String shortDescription;
    private String referenceURL;
    private Double proposedPrice;
    private LocalDateTime proposedDeadline;
    private String status; // PENDING, REJECTED, ACCEPTED
    private String artistReply;
    private LocalDateTime requestAt;
    private LocalDateTime respondedAt;

	public CommissionRequest() {
	}

	public CommissionRequest(int ID, int clientID, int artistID, String shortDescription, String referenceURL, Double proposedPrice, LocalDateTime proposedDeadline, String status, String artistReply, LocalDateTime requestAt, LocalDateTime respondedAt) {
        this.ID = ID;
        this.clientID = clientID;
        this.artistID = artistID;
        this.shortDescription = shortDescription;
        this.referenceURL = referenceURL;
        this.proposedPrice = proposedPrice;
        this.proposedDeadline = proposedDeadline;
        this.status = status;
        this.artistReply = artistReply;
        this.requestAt = requestAt;
        this.respondedAt = respondedAt;
    }

    public int getID() { return ID; }
    public int getClientID() { return clientID; }
    public int getArtistID() { return artistID; }
    public String getShortDescription() { return shortDescription; }
    public String getReferenceURL() { return referenceURL; }
    public Double getProposedPrice() { return proposedPrice; }
    public LocalDateTime getProposedDeadline() { return proposedDeadline; }
    public String getStatus() { return status; }
    public String getArtistReply() { return artistReply; }
    public LocalDateTime getRequestAt() { return requestAt; }
    public LocalDateTime getRespondedAt() { return respondedAt; }
	
	public void setID(int ID) {
		this.ID = ID;
	}

	public void setClientID(int clientID) {
		this.clientID = clientID;
	}

	public void setArtistID(int artistID) {
		this.artistID = artistID;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public void setReferenceURL(String referenceURL) {
		this.referenceURL = referenceURL;
	}

	public void setProposedPrice(Double proposedPrice) {
		this.proposedPrice = proposedPrice;
	}

	public void setProposedDeadline(LocalDateTime proposedDeadline) {
		this.proposedDeadline = proposedDeadline;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setArtistReply(String artistReply) {
		this.artistReply = artistReply;
	}

	public void setRequestAt(LocalDateTime requestAt) {
		this.requestAt = requestAt;
	}

	public void setRespondedAt(LocalDateTime respondedAt) {
		this.respondedAt = respondedAt;
	}

} 