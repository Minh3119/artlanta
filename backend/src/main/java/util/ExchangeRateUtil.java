/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.HttpURLConnection;
import java.net.URL;
import validation.EnvConfig;

/**
 *
 * @author anhkt
 */
public class ExchangeRateUtil {
    public static BigDecimal getUsdToVndRate() {
        EnvConfig configReader = new EnvConfig();
        String apiKey = configReader.getProperty("exchangerate");
        String apiUrl = "https://v6.exchangerate-api.com/v6/" + apiKey + "/latest/USD";
        try {
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                JsonObject json = JsonParser.parseReader(reader).getAsJsonObject();
                double vndRate = json.getAsJsonObject("conversion_rates").get("VND").getAsDouble();
                return BigDecimal.valueOf(vndRate).setScale(0, RoundingMode.DOWN);
            }
        } catch (Exception e) {
            System.err.println("Lỗi lấy tỷ giá: " + e.getMessage());
            return new BigDecimal("26000");
        }
    }
}
