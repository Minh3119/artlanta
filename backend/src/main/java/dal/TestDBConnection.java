package dal;

public class TestDBConnection {
    public static void main(String[] args) {
        dal.DBContext db = new dal.DBContext();
        if (db.connection != null) {
            System.out.println("✅ MySQL Connection successful!");
        } else {
            System.out.println("❌ MySQL Connection failed!");
        }
    }
}
