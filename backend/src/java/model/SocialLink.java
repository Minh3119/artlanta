/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

/**
 *
 * @author ADMIN
 */
public class SocialLink {
    private String Platform;
    private String Link;

    public SocialLink(String Platform, String Link) {
        this.Platform = Platform;
        this.Link = Link;
    }

    public String getPlatform() {
        return Platform;
    }

    public String getLink() {
        return Link;
    }
    
}
