package controller.Live;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import dal.AuctionDAO;
import dal.LiveDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import model.Auction;
import org.json.JSONObject;
import util.JsonUtil;
import util.SessionUtil;
import validation.EnvConfig;

@MultipartConfig(
        fileSizeThreshold = 1024 * 1024 * 2,
        maxFileSize = 1024 * 1024 * 10,
        maxRequestSize = 1024 * 1024 * 50
)
public class AddAuction extends HttpServlet {

    private List<Auction> uploadImagesToCloudinary(List<Auction> auctions, Cloudinary cloudinary, HttpServletResponse response)
            throws IOException {
        List<Auction> uploadedImages = new ArrayList<>();

        for (Auction auction : auctions) {
            Part part = auction.getImage();
            if (part != null && part.getSize() > 0) {
                try (InputStream inputStream = part.getInputStream(); ByteArrayOutputStream buffer = new ByteArrayOutputStream()) {

                    byte[] data = new byte[1024];
                    int bytesRead;
                    while ((bytesRead = inputStream.read(data, 0, data.length)) != -1) {
                        buffer.write(data, 0, bytesRead);
                    }

                    byte[] fileBytes = buffer.toByteArray();

                    Map<String, Object> uploadResult = cloudinary.uploader().upload(
                            fileBytes,
                            ObjectUtils.asMap("resource_type", "image")
                    );

                    String imageUrl = uploadResult.get("secure_url").toString();

                    uploadedImages.add(new Auction(auction.getImage(), imageUrl, auction.getStartPrice()));

                } catch (Exception e) {
                    e.printStackTrace();
                    continue;
                }
            }
        }

        return uploadedImages;
    }

    private List<Auction> extractAuctionList(HttpServletRequest request, int total) throws Exception {
        List<Auction> imageList = new ArrayList<>();
        for (int i = 0; i < total; i++) {
            Part imagePart = request.getPart("image_" + i);
            int startPrice = Integer.parseInt(request.getParameter("startPrice_" + i));
            if (imagePart != null) {
                imageList.add(new Auction(imagePart, startPrice));
            }
        }
        return imageList;
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        EnvConfig config = new EnvConfig();

        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", config.getProperty("my_cloud_name"),
                "api_key", config.getProperty("my_key"),
                "api_secret", config.getProperty("my_secret")
        ));

        HttpSession session = request.getSession();

        List<Auction> imageUrl = new ArrayList<>();
        try {
            String liveID_raw = request.getParameter("liveID");
            
            String total_raw = request.getParameter("total");
            int total = Integer.parseInt(total_raw);
            int liveID=Integer.parseInt(liveID_raw);
            if (total > 0) {
                List<Auction> imageList = extractAuctionList(request, total);
                imageUrl = uploadImagesToCloudinary(imageList, cloudinary, response);
            }

            Integer userID = SessionUtil.getCurrentUserId(session);
            if (userID == null) {
                JsonUtil.writeJsonResponse(response, new JSONObject().put("error", "Login first"));
                return;
            }

            

            AuctionDAO ad= new AuctionDAO();
            ad.insertAuctionList(userID, liveID, imageUrl);
            
//            JsonUtil.writeJsonResponse(response, new JSONObject().put("response", ID));
        } catch (Exception e) {
            e.printStackTrace();
            JsonUtil.writeJsonResponse(response, new JSONObject().put("error", "Server error"));
        }
    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
