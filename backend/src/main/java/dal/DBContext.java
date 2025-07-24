package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import validation.EnvConfig;

public class DBContext {
    protected Connection connection;
    
    public DBContext() {
        try {
            EnvConfig configReader = new EnvConfig();
            String url = String.format("jdbc:mysql://localhost:3306/Artlanta?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC", configReader.getProperty("db_url"));
            String username = configReader.getProperty("db_username", "root");
            String password = configReader.getProperty("db_password", "123456789");
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

}
