
package controller.Live;

import jakarta.websocket.Encoder;
import jakarta.websocket.EndpointConfig;
import model.LiveChatMessage;
import org.json.JSONObject;


public class ChatMessageEncode implements Encoder.Text<LiveChatMessage> {
    @Override
    public String encode(LiveChatMessage msg) {
        JSONObject json = new JSONObject();
        json.put("Username", msg.getUsername());
        json.put("Message", msg.getMessage());
        return json.toString();
    }

    @Override
    public void init(EndpointConfig config) {}
    @Override
    public void destroy() {}
}
