package model;

import java.time.LocalDateTime;

public class Portfolio {
    private int artistID;
    private String title;
    private String description;
    private String coverURL;
    private String achievements;
    private LocalDateTime createdAt;

    public Portfolio(int artistID, String title, String description, String coverURL, String achievements, LocalDateTime createdAt) {
        this.artistID = artistID;
        this.title = title;
        this.description = description;
        this.coverURL = coverURL;
        this.achievements = achievements;
        this.createdAt = createdAt;
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

    public String getCoverURL() {
        return coverURL;
    }

    public String getAchievements() {
        return achievements;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

} 