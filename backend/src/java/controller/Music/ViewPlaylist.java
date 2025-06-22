package controller.Music;

import dal.MusicDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import model.Music;
import util.SessionUtil;

public class ViewPlaylist extends HttpServlet {
   

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        HttpSession session = request.getSession();
        MusicDAO md= new MusicDAO();
        List<Music> list= new ArrayList<>();
        try{
            Integer userID = SessionUtil.getCurrentUserId(session);
            list= md.getPlaylistByUserID(userID);
            
        }
        catch(Exception e){
            e.printStackTrace();
        }
    } 


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {

    }

    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
