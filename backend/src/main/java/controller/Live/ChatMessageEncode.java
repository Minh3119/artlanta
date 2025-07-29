
package controller.Live;

import jakarta.websocket.Encoder;
import jakarta.websocket.EndpointConfig;
import model.LiveChatMessage;
import model.User;
import org.json.JSONObject;


public class ChatMessageEncode implements Encoder.Text<LiveChatMessage> {
    @Override
    public String encode(LiveChatMessage msg) {
        
        JSONObject json = new JSONObject();
        json.put("UserID", msg.getUserID());  
        json.put("Username", msg.getUsername());
        json.put("Avatar", msg.getAvatar());
        json.put("Message", msg.getMessage());
        json.put("Type", msg.getType());
         
        return json.toString();
    }

    @Override
    public void init(EndpointConfig config) {}
    @Override
    public void destroy() {}
}
