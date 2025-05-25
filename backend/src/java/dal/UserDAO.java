package dal;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import model.SocialLink;

import model.User;

public class UserDAO extends DBContext {

    public User getOneToEdit(int userID) {
        User u = new User();
        List<SocialLink> social = new ArrayList();
        try {
//            String sql = """
//                             Select u.ID, u.AvatarURL, u.Username, u.Fullname, u.Gender, u.DOB, u.Email, s.Platform, s.URL, u.Location, u.Bio from Users as u join UserSocialLinks as s on u.ID=s.UserID
//                             where u.ID=?;
//                             """;
            String sql = """
                         Select u.ID, u.AvatarURL, u.Username, u.Fullname, u.Gender, u.DOB, u.Email, s.Platform, s.URL, u.Location, u.Bio from Users as u join UserSocialLinks as s on u.ID=s.UserID
                         where u.ID=?;
                         """;
            PreparedStatement st = connection.prepareStatement(sql);
            st.setInt(1, userID);
            ResultSet rs = st.executeQuery();
            while (rs.next()) {
                if (u.getID() == 0) {
                    u.setID(rs.getInt("ID"));
                    u.setLogo(rs.getString("AvatarURL"));
                    u.setUsername(rs.getString("Username"));
                    u.setFullname(rs.getString("Fullname"));
                    u.setDob(rs.getTimestamp("DOB"));
                    u.setEmail(rs.getString("Email"));
                    u.setLocation(rs.getString("Location"));
                    u.setDescription(rs.getString("Bio"));
                    u.setGender(rs.getInt("Gender") == 1 ? "Male" : "Female");
                }
                social.add(new SocialLink(rs.getString("s.Platform"), rs.getString("s.URL")));

            }
            u.setSocial(social);
            return u;
        } catch (Exception e) {
            e.printStackTrace();
        }
//        new User(10,"logo","UserN","FullN","Male","12","ndluong@gmail.com",social,"Hanoi","description bio")
        return u;
    }

}
