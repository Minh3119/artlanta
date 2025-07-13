/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package model;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 *
 * @author anhkt
 */
public class Transaction {
    private int id;
    private int userId;
    private String paymentMethod;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String description;
    private Timestamp createdAt;

    public Transaction(int id, int userId, String paymentMethod, BigDecimal amount, String currency, String status, String description, Timestamp createdAt) {
        this.id = id;
        this.userId = userId;
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.description = description;
        this.createdAt = createdAt;
    }
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}