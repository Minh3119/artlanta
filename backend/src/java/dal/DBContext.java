package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DBContext {
    protected Connection connection;
    
    public DBContext() {
        try {
            // Edit URL , username, password to authenticate with your database server
            String url = "jdbc:mysql://localhost:3306/artlanta?useSSL=false";
            String username = "root";
            String password = "1234";
            Class.forName("com.mysql.cj.jdbc.Driver");
            connection = DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println("Error Connecting to Database: " + e.getMessage());
        }
    }
    
    public Connection getConnection() {
        return connection;
    }
}