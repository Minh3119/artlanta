package model;

import java.time.LocalDateTime;

public class Commission {
    private int ID;
    private int requestID;
    private int paymentID;
    private LocalDateTime deadline;
    private String status;  // PROCESSING or DONE or CANCELLED
    private LocalDateTime createdAt;

    public Commission(int ID, int requestID, int paymentID, LocalDateTime deadline, String status, LocalDateTime createdAt) {
        this.ID = ID;
        this.requestID = requestID;
        this.paymentID = paymentID;
        this.deadline = deadline;
        this.status = status;
        this.createdAt = createdAt;
    }

    public int getID() {
        return ID;
    }

    public int getRequestID() {
        return requestID;
    }

    public int getPaymentID() {
        return paymentID;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

} 