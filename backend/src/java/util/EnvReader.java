package utils;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

public class EnvReader {
    private static final Map<String, String> envVariables = new HashMap<>();
    private static boolean isLoaded = false;

    public static void loadEnv(String fullPath) {
        if (isLoaded) return;

        try {
            File envFile = new File(fullPath);
            if (!envFile.exists()) {
                System.err.println("env.txt không tồn tại tại: " + fullPath);
                return;
            }

            try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) continue;

                    int equalIndex = line.indexOf('=');
                    if (equalIndex > 0) {
                        String key = line.substring(0, equalIndex).trim();
                        String value = line.substring(equalIndex + 1).trim();
                        if (value.startsWith("\"") && value.endsWith("\"")) {
                            value = value.substring(1, value.length() - 1);
                        }
                        envVariables.put(key, value);
                    }
                }
            }

            isLoaded = true;
            System.out.println("Loaded " + envVariables.size() + " biến từ env.txt");

        } catch (IOException e) {
            System.err.println("Lỗi đọc env.txt: " + e.getMessage());
        }
    }

    public static String getEnv(String key) {
        return envVariables.get(key);
    }
}