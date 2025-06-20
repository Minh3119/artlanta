package controller.Music;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
        try{
            
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
