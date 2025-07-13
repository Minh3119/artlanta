package controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import model.Media;
import org.json.JSONObject;
import service.MediaService;
import util.JsonUtil;
import validation.EnvConfig;

@WebServlet("/api/upload")
@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class UploadServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Collection<Part> parts = request.getParts();
        List<Media> uploadedImages = new ArrayList<>();

        try {
            EnvConfig config = new EnvConfig();
            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
				"cloud_name", config.getProperty("my_cloud_name"),
                "api_key", config.getProperty("my_key"),
                "api_secret", config.getProperty("my_secret")
            ));

            for (Part part : parts) {
                if (part.getName().equals("file[]") && part.getSize() > 0) {
                    try (InputStream fileStream = part.getInputStream();
                         ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

                        byte[] data = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = fileStream.read(data, 0, data.length)) != -1) {
                            buffer.write(data, 0, bytesRead);
                        }
                        byte[] fileBytes = buffer.toByteArray();

                        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                                fileBytes, ObjectUtils.asMap("resource_type", "image"));

                        uploadedImages.add(new Media(0, uploadResult.get("secure_url").toString(), ""));
                    } catch (Exception e) {
                        JsonUtil.writeJsonError(response, "Upload error: " + e.getMessage());
                        return;
                    }
                }
            }

            if (uploadedImages.isEmpty()) {
                JsonUtil.writeJsonError(response, "No files were uploaded");
                return;
            }

			JSONObject jsonMedia = new JSONObject();
			jsonMedia.put("response", MediaService.convertMediaListToJsonArray(uploadedImages));
            JsonUtil.writeJsonResponse(response, jsonMedia);

        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Server error: " + e.getMessage());
        }
    }
}