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
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Scanner;
import model.Media;
import model.Post;
import model.PostMedia;
import org.json.JSONArray;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;
import validation.EnvConfig;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class UpdatePost extends HttpServlet {

    //deleteImageFromCloudinary
    //get URL-> split by / -> select the public_ID -> remove .png and .jsp
    //destroy
    private void deleteImageFromCloudinary(Cloudinary cloudinary, HttpServletResponse response, List<Media> oldImages) {
        for (Media media : oldImages) {
            try {
                String imageUrl = media.getURL();

                String[] parts = imageUrl.split("/");
                String publicIdWithExtension = parts[parts.length - 1];
                String publicId = publicIdWithExtension.split("\\.")[0];

                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private List<Media> uploadImagesToCloudinary(Collection<Part> parts, Cloudinary cloudinary, HttpServletResponse response) throws IOException {
        List<Media> imageUrl = new ArrayList<>();

        for (Part part : parts) {
            if (part.getName().startsWith("file") && part.getSize() > 0) {
                try (InputStream fileStream = part.getInputStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

                    byte[] data = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = fileStream.read(data, 0, data.length)) != -1) {
                        buffer.write(data, 0, bytesRead);
                    }
                    byte[] fileBytes = buffer.toByteArray();

                    Map<String, Object> uploadResult = cloudinary.uploader().upload(
                            fileBytes, ObjectUtils.asMap("resource_type", "image"));

                    imageUrl.add(new Media(0, uploadResult.get("secure_url").toString(), ""));

                } catch (Exception e) {
                    JsonUtil.writeJsonError(response, "Upload error: " + e.getMessage());
                    return null;
                }
            }
        }

        return imageUrl;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        String raw_postID = request.getParameter("postID");
        int postID;

        try {
//            String rawPostID = request.getParameter("postID");
//            if (rawPostID == null || rawPostID.trim().isEmpty()) {
//                JsonUtil.writeJsonError(response, "Thiếu tham số postID");
//                return;
//            }

//            int postID = Integer.parseInt(rawPostID.trim());
            postID = Integer.parseInt(raw_postID);

            PostDAO pd = new PostDAO();
            MediaDAO md = new MediaDAO();

            Post post = pd.getPost(postID);
            if (post == null) {
                JsonUtil.writeJsonError(response, "No post with postID = " + postID);
                return;
            }

            List<Media> imageList = md.getPostMediaByID(postID);
            if (imageList == null) {
                imageList = new ArrayList<>();
            }

            if (post.getContent() == null || post.getContent().trim().isEmpty()) {
                JsonUtil.writeJsonError(response, "Title cannot be empty");
                return;
            }

            JSONObject jsonPost = new JSONObject();
            jsonPost.put("postID", post.getID());
            jsonPost.put("content", post.getContent());
            jsonPost.put("visibility", post.getVisibility().toUpperCase());

            JSONArray imageArr = new JSONArray();
            for (Media media : imageList) {
                JSONObject obj = new JSONObject();
                obj.put("ID", media.getID());
                obj.put("mediaURL", media.getURL());
                imageArr.put(obj);
            }
            jsonPost.put("imageUrl", imageArr);

            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("response", jsonPost);

            JsonUtil.writeJsonResponse(response, jsonResponse);

        } catch (NumberFormatException e) {
            JsonUtil.writeJsonError(response, "postID must be an integer >0");
        } catch (Exception e) {
            JsonUtil.writeJsonError(response, "Server error: " + e.getMessage());
            e.printStackTrace();
        }

    }

    //doPost
    //catching the data from UI
    //uploading the file into Cloudinary
    //URL gen
    //deletePost -> PostMedia delete -> Media delete according to postID
    //re-insert into db
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        //        Declaration
        Collection<Part> parts = request.getParts();
        String[] idList = request.getParameterValues("ID");
        HttpSession session = request.getSession();
        List<Media> imageUrl = new ArrayList<>();
        PostDAO pd = new PostDAO();
        MediaDAO md = new MediaDAO();
        String raw_ID = request.getParameter("postID");
        int postID;
//        String title = request.getParameter("title");
        String content = request.getParameter("content");
        String visibility = request.getParameter("visibility");

        EnvConfig config = new EnvConfig();
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", config.getProperty("my_cloud_name"),
                "api_key", config.getProperty("my_key"),
                "api_secret", config.getProperty("my_secret")
        ));
        try {
            postID = Integer.parseInt(raw_ID);
            if (content == null || content.trim().isEmpty()) {
                JsonUtil.writeJsonError(response, "Missing required fields");
                return;
            }
            Integer userID = SessionUtil.getCurrentUserId(session);
            if (userID == null) {
                JsonUtil.writeJsonError(response, "User not logged in");
                return;
            }
            List<Media> oldImages = new ArrayList<>();
            for (String id_raw : idList) {
                int id = Integer.parseInt(id_raw);
                oldImages.add(md.getMediaByID(id));
                md.deleteMediaByID(id);
                md.deletePostMediaByID(id);
            }
            deleteImageFromCloudinary(cloudinary, response, oldImages);

            imageUrl = uploadImagesToCloudinary(parts, cloudinary, response);
            if (imageUrl == null) {
                return;
            }

            pd.updatePost(new Post(
                    0,
                    userID,
                    content,
                    false,
                    visibility,
                    LocalDateTime.now(),
                    null,
                    false
            ), postID);
            md.updateMediaByPostID(postID, imageUrl);

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
