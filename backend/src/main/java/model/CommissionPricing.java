package model;

public class CommissionPricing {
    private int ID;
    private int artistID;
    private String title;
    private String description;
    private int price;
    private int estimatedDays;

    public CommissionPricing(int ID, int artistID, String title, String description, int price, int estimatedDays) {
        this.ID = ID;
        this.artistID = artistID;
        this.title = title;
        this.description = description;
        this.price = price;
        this.estimatedDays = estimatedDays;
    }

    public int getID() {
        return ID;
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

    public int getPrice() {
        return price;
    }

    public int getEstimatedDays() {
        return estimatedDays;
    }

} 