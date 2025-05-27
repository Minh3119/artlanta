package model;

public class Payment {
    private int ID;
    private int price;
    private String type;  // Paypal or ATM or VietQR
    private int tax;

    public Payment(int ID, int price, String type, int tax) {
        this.ID = ID;
        this.price = price;
        this.type = type;
        this.tax = tax;
    }

    public int getID() {
        return ID;
    }

    public int getPrice() {
        return price;
    }

    public String getType() {
        return type;
    }

    public int getTax() {
        return tax;
    }

} 