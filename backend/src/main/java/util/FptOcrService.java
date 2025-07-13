/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import jakarta.servlet.http.Part;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import validation.EnvConfig;

public class FptOcrService {
    private static final EnvConfig CONFIG_READER = new EnvConfig();
    private static final String OCR_URL = CONFIG_READER.getProperty("OCR_URL");
    private static final String FACE_MATCH_URL = CONFIG_READER.getProperty("FACE_MATCH_URL");
    private static final String API_KEY = CONFIG_READER.getProperty("APIFPTKEY");
    
    public static boolean verifyCccd(Part cccdImage) {
        if (cccdImage == null) {
            return false;
        }
        
        try {
            HttpClient client = HttpClient.newHttpClient();
            String boundary = generateBoundary();
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(OCR_URL))
                .header("api-key", API_KEY)
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(buildBodyWithOnePart(cccdImage, "image", boundary))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                return false;
            }
            
            String body = response.body();
            
            try {
                JsonObject jsonObject = JsonParser.parseString(body).getAsJsonObject();
                
                if (jsonObject.has("id_number")) {
                    String idNumber = jsonObject.get("id_number").getAsString();
                    return idNumber != null && !idNumber.trim().isEmpty();
                }
                
                return false;
                
            } catch (JsonSyntaxException e) {
                return body.contains("\"id_number\"");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    public static boolean verifyFaceMatch(Part cccdImage, Part faceImage) {
        if (cccdImage == null || faceImage == null) {
            return false;
        }
        
        try {
            HttpClient client = HttpClient.newHttpClient();
            String boundary = generateBoundary();
            
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(FACE_MATCH_URL))
                .header("api-key", API_KEY)
                .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                .POST(buildBodyWithTwoParts(cccdImage, faceImage, boundary))
                .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() != 200) {
                return false;
            }
            
            String body = response.body();
            
            try {
                JsonObject jsonObject = JsonParser.parseString(body).getAsJsonObject();
                
                if (jsonObject.has("confidence")) {
                    double confidence = jsonObject.get("confidence").getAsDouble();
                    return confidence >= 0.8;
                }
                
                return false;
                
            } catch (JsonSyntaxException | NumberFormatException e) {
                return body.contains("\"confidence\":") && body.contains("0.8");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private static String generateBoundary() {
        return "----FormBoundary" + UUID.randomUUID().toString().replace("-", "");
    }
    
    private static HttpRequest.BodyPublisher buildBodyWithOnePart(Part part, String fieldName, String boundary) throws IOException {
        List<byte[]> byteArrays = new ArrayList<>();

        byteArrays.add(("--" + boundary + "\r\n").getBytes());
        byteArrays.add(("Content-Disposition: form-data; name=\"" + fieldName + "\"; filename=\"" + part.getSubmittedFileName() + "\"\r\n").getBytes());
        byteArrays.add(("Content-Type: " + part.getContentType() + "\r\n\r\n").getBytes());
        
        try (var inputStream = part.getInputStream()) {
            byteArrays.add(inputStream.readAllBytes());
        }
        
        byteArrays.add(("\r\n--" + boundary + "--\r\n").getBytes());

        return HttpRequest.BodyPublishers.ofByteArrays(byteArrays);
    }
    
    private static HttpRequest.BodyPublisher buildBodyWithTwoParts(Part part1, Part part2, String boundary) throws IOException {
        List<byte[]> byteArrays = new ArrayList<>();

        // Part 1 - CCCD Image
        byteArrays.add(("--" + boundary + "\r\n").getBytes());
        byteArrays.add(("Content-Disposition: form-data; name=\"image1\"; filename=\"" + part1.getSubmittedFileName() + "\"\r\n").getBytes());
        byteArrays.add(("Content-Type: " + part1.getContentType() + "\r\n\r\n").getBytes());
        
        try (var inputStream = part1.getInputStream()) {
            byteArrays.add(inputStream.readAllBytes());
        }

        // Part 2 - Face Image
        byteArrays.add(("\r\n--" + boundary + "\r\n").getBytes());
        byteArrays.add(("Content-Disposition: form-data; name=\"image2\"; filename=\"" + part2.getSubmittedFileName() + "\"\r\n").getBytes());
        byteArrays.add(("Content-Type: " + part2.getContentType() + "\r\n\r\n").getBytes());
        
        try (var inputStream = part2.getInputStream()) {
            byteArrays.add(inputStream.readAllBytes());
        }

        byteArrays.add(("\r\n--" + boundary + "--\r\n").getBytes());

        return HttpRequest.BodyPublishers.ofByteArrays(byteArrays);
    }
}