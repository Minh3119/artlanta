package controller.Post;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import dal.MediaDAO;
import dal.PostDAO;
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
import java.time.LocalDateTime;
import java.util.Map;
import model.Media;
import model.Post;
import model.PostMedia;
import org.json.JSONObject;
import util.JsonUtil;
import validation.EnvConfig;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class CreatePost extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        JsonUtil.writeJsonError(response, "POST method required");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        String visibility = request.getParameter("visibility");
//        boolean isDraft = Boolean.parseBoolean(request.getParameter("isDraft"));
        try {

            if (title == null || title.trim().isEmpty()
                    || content == null || content.trim().isEmpty()
                    || visibility == null || visibility.trim().isEmpty()) {
                JsonUtil.writeJsonError(response, "Missing required fields");
                return;
            }

            Integer userID = (Integer) request.getSession().getAttribute("userID");
            userID = 10;
            if (userID == null) {
                JsonUtil.writeJsonError(response, "User not logged in");
                return;
            }

            Part filePart = request.getPart("file");
            String imageUrl = null;
            if (filePart != null && filePart.getSize() > 0) {
                try (InputStream fileStream = filePart.getInputStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

                    byte[] data = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = fileStream.read(data, 0, data.length)) != -1) {
                        buffer.write(data, 0, bytesRead);
                    }
                    byte[] fileBytes = buffer.toByteArray();

                    EnvConfig config = new EnvConfig(getServletContext());
                    Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                            "cloud_name", config.getProperty("my_cloud_name"),
                            "api_key", config.getProperty("my_key"),
                            "api_secret", config.getProperty("my_secret")
                    ));

                    Map<String, Object> uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.asMap("resource_type", "image"));
                    imageUrl = uploadResult.get("secure_url").toString();
                } catch (Exception e) {
                    JsonUtil.writeJsonError(response, "Error uploading image: " + e.getMessage());
                    return;
                }
            }

//            Post post = new Post(
//                    0,
//                    userID,
//                    title,
//                    content,
//                    false,
//                    visibility,
//                    LocalDateTime.now(),
//                    null,
//                    false
//            );
//            Media media = new Media(0, imageUrl);

            PostDAO pd = new PostDAO();
            pd.createPost(new Post(
                    0,
                    userID,
                    title,
                    content,
                    false,
                    visibility,
                    LocalDateTime.now(),
                    null,
                    false
            ), new Media(0, imageUrl));

//            Test API
//            JSONObject jsonPost = new JSONObject();
//            jsonPost.put("title", post.getTitle());
//            jsonPost.put("content", post.getContent());
//            jsonPost.put("visibility", post.getVisibility());
//            jsonPost.put("isDraft", post.isDraft());
//            if (imageUrl != null) {
//                jsonPost.put("imageUrl", imageUrl);
//            }
//            JSONObject jsonResponse = new JSONObject();
//            jsonResponse.put("response", postID);
//            JsonUtil.writeJsonResponse(response, jsonResponse);
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "Error creating post: " + e.getMessage());
        }
    }
}
