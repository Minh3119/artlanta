package controller.Music;

import dal.MusicDAO;
import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import model.Music;
import util.SessionUtil;

public class InsertPlaylist extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    } 


    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        String playlistName= request.getParameter("playlistName");
        String playlistLink= request.getParameter("playlistLink");
        MusicDAO md= new MusicDAO();
        HttpSession session = request.getSession();
        try{
            Integer userID = SessionUtil.getCurrentUserId(session);
            md.insertPlaylist(new Music(0,userID,playlistName,playlistLink));
        }
        catch(Exception e){
            e.printStackTrace();
        }
        
    }
    @Override
    public String getServletInfo() {
        return "Short description";
    }

}
