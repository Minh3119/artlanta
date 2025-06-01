import org.json.JSONObject;

public class TestJSON {
    public static void main(String[] args) {
        JSONObject json = new JSONObject();
        json.put("name", "John");
        json.put("age", 30);
        System.out.println(json.toString(4));
    }
}