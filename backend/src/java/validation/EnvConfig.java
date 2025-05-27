
package validation;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.servlet.ServletContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
public class EnvConfig {
    private Properties properties;
    public EnvConfig(ServletContext context) {
        properties = new Properties();
        try (InputStream input = context.getResourceAsStream("/WEB-INF/config.properties")) {
            if (input == null) {
                throw new IOException("Không tìm thấy file config.properties trong WEB-INF");
            }
            properties.load(input);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi đọc file config.properties: " + e.getMessage());
        }
    }
    public String getProperty(String key) {
        return properties.getProperty(key);
    }
}
