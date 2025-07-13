package validation;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

public class EnvConfig {
    private Properties properties;
    
    public EnvConfig() {
        properties = new Properties();
        loadDefaultConfig();
    }

    public EnvConfig(String configPath) {
        properties = new Properties();
        loadFromFile(configPath);
    }
    
    private void loadFromFile(String filePath) {
        try (InputStream input = new java.io.FileInputStream(filePath)) {
            properties.load(input);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi đọc file config từ đường dẫn: " + e.getMessage());
        }
    }

    private void loadDefaultConfig() {
        // Try common configuration file locations
        String[] defaultPaths = {
            "config.properties",
            "WEB-INF/config.properties",
            "WEB-INF/classes/config.properties",
        };
        
        boolean loaded = false;
        for (String path : defaultPaths) {
            try (InputStream input = getClass().getClassLoader().getResourceAsStream(path)) {
                if (input != null) {
                    properties.load(input);
                    loaded = true;
                    break;
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        
        if (!loaded) {
            System.out.println("Cảnh báo: Không tìm thấy file config mặc định. Sử dụng Properties rỗng.");
        }
    }
    
    public String getProperty(String key) {
        return properties.getProperty(key);
    }
    
    public String getProperty(String key, String defaultValue) {
        return properties.getProperty(key, defaultValue);
    }
    
    // method to check if a property exists
    public boolean hasProperty(String key) {
        return properties.containsKey(key);
    }
    
}