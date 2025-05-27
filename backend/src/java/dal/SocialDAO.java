package dal;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.SocialLink;

import model.User;

public class SocialDAO extends DBContext{
    public void updateSocial(List<SocialLink> list,int userID){
        try{
            String sql="""
                       update UserSocialLinks set
                       Platform=?,
                       URL=?
                       where UserID=?
                       """;
            PreparedStatement st = connection.prepareStatement(sql);
            for(SocialLink social:list){
                st.setString(0, social.getPlatform());
                st.setString(1, social.getLink());
                st.setInt(2, userID);
                st.executeUpdate();
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }
}
