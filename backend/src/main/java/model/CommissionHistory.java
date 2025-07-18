package model;

import java.time.LocalDateTime;

public class CommissionHistory {
    private int id;
    private int commissionId;
    private String changedField;
    private String oldValue;
    private String newValue;
    private int changedBy;
    private LocalDateTime changedAt;

    public CommissionHistory() {}

    public CommissionHistory(int id, int commissionId, String changedField, String oldValue, String newValue, int changedBy, LocalDateTime changedAt) {
        this.id = id;
        this.commissionId = commissionId;
        this.changedField = changedField;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.changedBy = changedBy;
        this.changedAt = changedAt;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getCommissionId() { return commissionId; }
    public void setCommissionId(int commissionId) { this.commissionId = commissionId; }
    public String getChangedField() { return changedField; }
    public void setChangedField(String changedField) { this.changedField = changedField; }
    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }
    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }
    public int getChangedBy() { return changedBy; }
    public void setChangedBy(int changedBy) { this.changedBy = changedBy; }
    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }
} 