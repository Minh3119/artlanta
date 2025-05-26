package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBContext {
    protected Connection connection;

    public DBContext() {
        try {
            System.out.println("Initializing DBContext...");
            // Edit URL , username, password to authenticate with your MS SQL Server
            String url = "jdbc:mysql://localhost:3306/Artlanta?useSSL=false";
            String username = "root";
            String password = "1234";
            System.out.println("Loading JDBC driver...");
            //Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            Class.forName("com.mysql.cj.jdbc.Driver");  // ERROR: java.lang.ClassNotFoundException: com.mysql.cj.jdbc.Driver
            System.out.println("Driver loaded successfully.");
            System.out.println("Connecting to database...");
            connection = DriverManager.getConnection(url, username, password);
            System.out.println("Database connection established.");
        } catch (ClassNotFoundException ex) {
            System.err.println("JDBC Driver not found: " + ex.getMessage());
            ex.printStackTrace();
        } catch (SQLException ex) {
            System.err.println("SQL Exception: " + ex.getMessage());
            ex.printStackTrace();
        }
    }

    public static void main(String[] args) {
        System.out.println("Starting DBContext test...");
        DBContext db = new DBContext();
        if (db.connection != null) {
            System.out.println("Connection is valid!");
        } else {
            System.out.println("Failed to establish connection.");
        }
    }
}
