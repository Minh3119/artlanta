package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBContext {
    protected Connection connection;
    
    public DBContext() {
        try {
            String url = "jdbc:mysql://localhost:3306/artlanta?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&connectTimeout=5000&socketTimeout=10000";
            String username = "root";
            String password = "12345";
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException | SQLException e) {
            System.err.println("Error Connecting to Database: " + e.getMessage());
            throw new RuntimeException("Database connection failed", e);
        }
    }
    
    public Connection getConnection() {
        return connection;
    }
    
    public void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException e) {
                System.err.println("Error closing connection: " + e.getMessage());
            }
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
