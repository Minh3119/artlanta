package model;


public class Music {
    private int ID;
    private int userID;
    private String playlist;
    private String mediaURL;

    public Music() {
    }

    public Music(int ID, int userID, String playlist, String mediaURL) {
        this.ID = ID;
        this.userID = userID;
        this.playlist = playlist;
        this.mediaURL = mediaURL;
    }

    public Music(int userID, String playlist, String mediaURL) {
        this.userID = userID;
        this.playlist = playlist;
        this.mediaURL = mediaURL;
    }

    public int getID() {
        return ID;
    }

    public void setID(int ID) {
        this.ID = ID;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getPlaylist() {
        return playlist;
    }

    public void setPlaylist(String playlist) {
        this.playlist = playlist;
    }

    public String getMediaURL() {
        return mediaURL;
    }

    public void setMediaURL(String mediaURL) {
        this.mediaURL = mediaURL;
    }
    
}
