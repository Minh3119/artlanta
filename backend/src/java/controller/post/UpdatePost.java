package controller.post;

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
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import model.Media;
import model.Post;
import model.PostMedia;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import validation.EnvConfig;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class UpdatePost extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        try {
            String rawPostID = request.getParameter("postID");
            if (rawPostID == null || rawPostID.trim().isEmpty()) {
                JsonUtil.writeJsonError(response, "Thiếu tham số postID");
                return;
            }

//            int postID = Integer.parseInt(rawPostID.trim());
            int postID=10;

            PostDAO pd = new PostDAO();
            MediaDAO md = new MediaDAO();

            Post post = pd.getPost(postID);
            if (post == null) {
                JsonUtil.writeJsonError(response, "Không tìm thấy bài viết với postID = " + postID);
                return;
            }

            List<Media> imageList = md.getPostMediaByID(postID);
            if (imageList == null) {
                imageList = new ArrayList<>();
            }

            if (post.getTitle() == null || post.getTitle().trim().isEmpty()
                    || post.getContent() == null || post.getContent().trim().isEmpty()
                    || post.getVisibility() == null || post.getVisibility().trim().isEmpty()) {
                JsonUtil.writeJsonError(response, "Thiếu dữ liệu: title, content hoặc visibility");
                return;
            }

            JSONObject jsonPost = new JSONObject();
            jsonPost.put("title", post.getTitle());
            jsonPost.put("content", post.getContent());
            jsonPost.put("visibility", post.getVisibility());

            JSONArray imageArr = new JSONArray();
            for (Media media : imageList) {
                imageArr.put(media.getURL());
            }
            jsonPost.put("imageUrl", imageArr);

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("response", jsonPost);

            JsonUtil.writeJsonResponse(response, jsonResponse);

        } catch (NumberFormatException e) {
            JsonUtil.writeJsonError(response, "postID phải là số hợp lệ");
        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Lỗi máy chủ: " + e.getMessage());
            e.printStackTrace();
        }

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        //        Declaration
        Collection<Part> parts = request.getParts();
        List<Media> imageUrl = new ArrayList<>();
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        String visibility = request.getParameter("visibility");
        EnvConfig config = new EnvConfig(getServletContext());
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", config.getProperty("my_cloud_name"),
                "api_key", config.getProperty("my_key"),
                "api_secret", config.getProperty("my_secret")
        ));
        try {
            if (title == null || title.trim().isEmpty()) {
                JsonUtil.writeJsonError(response, "Missing required fields");
                return;
            }
            Integer userID = (Integer) request.getSession().getAttribute("userID");
            userID = 10;
            if (userID == null) {
                JsonUtil.writeJsonError(response, "User not logged in");
                return;
            }
            for (Part part : parts) {
                if (part.getName().equals("file[]") && part.getSize() > 0) {

                    try (InputStream fileStream = part.getInputStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

                        byte[] data = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = fileStream.read(data, 0, data.length)) != -1) {
                            buffer.write(data, 0, bytesRead);
                        }
                        byte[] fileBytes = buffer.toByteArray();

                        Map<String, Object> uploadResult = cloudinary.uploader().upload(
                                fileBytes, ObjectUtils.asMap("resource_type", "image"));

                        imageUrl.add(new Media(0, uploadResult.get("secure_url").toString()));

                    } catch (Exception e) {
                        JsonUtil.writeJsonError(response, "Upload error: " + e.getMessage());
                        return;
                    }
                }
            }
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
            ), imageUrl);

        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonError(response, "Error creating post: " + e.getMessage());
        }
        //            Test API
//        JSONObject jsonPost = new JSONObject();
//        jsonPost.put("title", post.getTitle());
//        jsonPost.put("content", post.getContent());
//        jsonPost.put("visibility", post.getVisibility());
//        jsonPost.put("isDraft", post.isDraft());
//        if (imageUrl != null) {
//            JSONArray li = new JSONArray();
//            for (Media media : imageUrl) {
//                li.put(media.getURL());
//            }
//            jsonPost.put("imageUrl", li);
//        }
//        JSONObject jsonResponse = new JSONObject();
//        jsonResponse.put("response", jsonPost);
//        JsonUtil.writeJsonResponse(response, jsonResponse);
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
