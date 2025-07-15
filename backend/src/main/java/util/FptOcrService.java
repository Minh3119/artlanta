/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import jakarta.servlet.http.Part;
import java.io.IOException;
import java.util.logging.Logger;
import validation.EnvConfig;

import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.InputStreamBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.util.EntityUtils;
import org.apache.http.entity.ContentType;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

public class FptOcrService {

    private static final EnvConfig CONFIG_READER = new EnvConfig();
    private static final String OCR_URL = CONFIG_READER.getProperty("OCR_URL");
    private static final String FACE_MATCH_URL = CONFIG_READER.getProperty("FACE_MATCH_URL");
    private static final String API_KEY = CONFIG_READER.getProperty("APIFPTKEY");
    private static final String PASSPORT_URL = CONFIG_READER.getProperty("PASSPORT_URL");

    public static boolean verifyDocument(Part imageNCheck, String typeImg) {
        if (imageNCheck == null) {
            return false;
        }

        try (CloseableHttpClient client = HttpClients.createDefault()) {

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody("image",
                    imageNCheck.getInputStream(),
                    ContentType.create(imageNCheck.getContentType()),
                    imageNCheck.getSubmittedFileName());

            HttpPost post;
            if ("cccd".equals(typeImg)) {
                post = new HttpPost(OCR_URL);
            } else if ("passport".equals(typeImg)) {
                post = new HttpPost(PASSPORT_URL);
            } else {
                return false;
            }

            post.setHeader("api-key", API_KEY);
            post.setEntity(builder.build());

            try (CloseableHttpResponse response = client.execute(post)) {
                int statusCode = response.getStatusLine().getStatusCode();

                if (statusCode != 200) {
                    return false;
                }

                String body = EntityUtils.toString(response.getEntity());

                try {
                    JsonObject jsonObject = JsonParser.parseString(body).getAsJsonObject();

                    if (jsonObject.has("errorCode") && jsonObject.get("errorCode").getAsInt() == 0) {
                        if (jsonObject.has("data") && jsonObject.get("data").isJsonArray()) {
                            var dataArray = jsonObject.getAsJsonArray("data");
                            if (dataArray.size() > 0) {
                                if ("cccd".equals(typeImg)) {
                                    var firstItem = dataArray.get(0).getAsJsonObject();
                                    if (firstItem.has("id")) {
                                        String idNumber = firstItem.get("id").getAsString();
                                        return idNumber != null && !idNumber.trim().isEmpty();
                                    }
                                } else if ("passport".equals(typeImg)) {
                                    var firstItem = dataArray.get(0).getAsJsonObject();
                                    if (firstItem.has("passport_number")) {
                                        String idNumber = firstItem.get("passport_number").getAsString();
                                        return idNumber != null && !idNumber.trim().isEmpty();
                                    }
                                } else {
                                    return false;
                                }
                            }
                        }
                    }

                    return false;

                } catch (JsonSyntaxException e) {
                    return body.contains("\"id\":");
                }
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

        try (CloseableHttpClient client = HttpClients.createDefault()) {

            // Tạo multipart entity với 2 images sử dụng file[]
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody("file[]",
                    cccdImage.getInputStream(),
                    ContentType.create(cccdImage.getContentType()),
                    cccdImage.getSubmittedFileName());
            builder.addBinaryBody("file[]",
                    faceImage.getInputStream(),
                    ContentType.create(faceImage.getContentType()),
                    faceImage.getSubmittedFileName());

            // Tạo POST request
            HttpPost post = new HttpPost(FACE_MATCH_URL);
            post.setHeader("api_key", API_KEY);  // Sử dụng api_key thay vì api-key
            post.setEntity(builder.build());

            // Thực hiện request
            try (CloseableHttpResponse response = client.execute(post)) {
                int statusCode = response.getStatusLine().getStatusCode();

                if (statusCode != 200) {
                    return false;
                }

                String body = EntityUtils.toString(response.getEntity());

                try {
                    JsonObject jsonObject = JsonParser.parseString(body).getAsJsonObject();

                    // Kiểm tra code = "200" (thành công)
                    if (jsonObject.has("code") && "200".equals(jsonObject.get("code").getAsString())) {
                        // Kiểm tra có data object không
                        if (jsonObject.has("data") && jsonObject.get("data").isJsonObject()) {
                            var dataObject = jsonObject.getAsJsonObject("data");

                            // Lấy kết quả isMatch
                            if (dataObject.has("isMatch")) {
                                return dataObject.get("isMatch").getAsBoolean();
                            }
                        }
                    }

                    return false;

                } catch (JsonSyntaxException e) {
                    return body.contains("\"isMatch\":true");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
