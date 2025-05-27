package controller.Post;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import dal.PostDAO;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Map;
import model.Post;
import validation.EnvConfig;

@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2,
    maxFileSize = 1024 * 1024 * 10,   
    maxRequestSize = 1024 * 1024 * 50   
)
public class CreatePost extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        out.println("<h1>API is working</h1>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        String title = request.getParameter("title");
        String content = request.getParameter("content");
        String visibility = request.getParameter("visibility");

        Part filePart = request.getPart("file");
        //test session
        PostDAO pd = new PostDAO();
        HttpSession session = request.getSession();
        EnvConfig config= new EnvConfig(getServletContext());
        
        session.setAttribute("userID", 11);
        String imageUrl = null;
        if (filePart != null && filePart.getSize() > 0) {
            try (InputStream fileStream = filePart.getInputStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

                byte[] data = new byte[1024];
                int bytesRead;
                while ((bytesRead = fileStream.read(data, 0, data.length)) != -1) {
                    buffer.write(data, 0, bytesRead);
                }
                byte[] fileBytes = buffer.toByteArray();

                Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                        "cloud_name", config.getProperty("my_cloud_name"),
                        "api_key", config.getProperty("my_key"),
                        "api_secret", config.getProperty("my_secret")
                ));

                Map<String, Object> uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.asMap("resource_type", "image"));
                imageUrl = uploadResult.get("secure_url").toString();

            } catch (Exception e) {
                e.printStackTrace();
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Lỗi khi upload ảnh lên Cloudinary: " + e.getMessage());
                return;
            }
        }

        int userID=11;
        Post post = new Post(userID, title, content, imageUrl, visibility);
        try {
            pd.createPost(post);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
