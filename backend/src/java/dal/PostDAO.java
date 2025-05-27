/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package dal;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import model.Post;

/**
 *
 * @author ADMIN
 */
public class PostDAO extends DBContext {

    public void createPost(Post post) {
        try {
            String sql = """
                    INSERT INTO Posts (UserID, Title, Content, MediaURL, Visibility)
                    VALUES (?,?,?,?,?);
                    """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, post.getUserID());
            st.setString(2, post.getTitle());
            st.setString(3, post.getContent());
            st.setString(4, post.getMediaURL());
            st.setString(5, post.getVisibility());
            st.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
    public void createPostNoImage(Post post) {
        try {
            String sql = """
                    INSERT INTO Posts (UserID, Title, Content, Visibility)
                    VALUES (?,?,?,?);
                    """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, post.getUserID());
            st.setString(2, post.getTitle());
            st.setString(3, post.getContent());
//            st.setString(4, post.getMediaURL());
            st.setString(4, post.getVisibility());
            st.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
