/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.net.HttpURLConnection;
import java.net.URL;
import org.json.JSONObject;

/**
 *
 * @author anhkt
 */
public class CurrencyConverter {
    public static BigDecimal getUSDtoVND() {
        try {
            URL url = new URL("https://api.exchangerate.host/convert?from=USD&to=VND");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) sb.append(line);

            JSONObject obj = new JSONObject(sb.toString());
            return obj.getBigDecimal("result");
        } catch (Exception e) {
            e.printStackTrace();
            return new BigDecimal("25000");
        }
    }
}
