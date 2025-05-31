package model;

public class PortfolioMedia {
    private int ArtistID;
    private int MediaID;

    public PortfolioMedia() {
    }

    public PortfolioMedia(int ArtistID, int MediaID) {
        this.ArtistID = ArtistID;
        this.MediaID = MediaID;
    }

    public int getArtistID() {
        return ArtistID;
    }

    public void setArtistID(int ArtistID) {
        this.ArtistID = ArtistID;
    }

    public int getMediaID() {
        return MediaID;
    }

    public void setMediaID(int MediaID) {
        this.MediaID = MediaID;
    }
} 