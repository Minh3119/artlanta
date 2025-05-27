package dal;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DBContext {
    protected Connection connection;
    public DBContext()
    {
        try {
            // Edit URL , username, password to authenticate with your MS SQL Server
            String url = "jdbc:mysql://localhost:3306/artlanta?useSSL=false";
            String username = "root";
            String password = "1234";
            Class.forName("com.mysql.cj.jdbc.Driver");
            this.connection = DriverManager.getConnection(url, username, password);
//            System.out.println("Connected to MySQL successfully!");
        } catch (ClassNotFoundException | SQLException ex) {
            ex.printStackTrace();
        }
    }
}