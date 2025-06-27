/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.time.LocalDateTime;

/**
 *
 * @author Asus
 */
public class ReportPost {
	private int reportedID;
	private int postID;
	private String reason;
	 private LocalDateTime reportAt;
	private String status;

	public ReportPost(int reportedID, int postID, String reason, LocalDateTime reportAt, String status) {
		this.reportedID = reportedID;
		this.postID = postID;
		this.reason = reason;
		this.reportAt = reportAt;
		this.status = status;
	}



	public int getReportedID() {
		return reportedID;
	}

	public void setReportedID(int reportedID) {
		this.reportedID = reportedID;
	}

	public int getPostID() {
		return postID;
	}

	public void setPostID(int postID) {
		this.postID = postID;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public LocalDateTime getReportAt() {
		return reportAt;
	}

	public void setReportAt(LocalDateTime reportAt) {
		this.reportAt = reportAt;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	
}
