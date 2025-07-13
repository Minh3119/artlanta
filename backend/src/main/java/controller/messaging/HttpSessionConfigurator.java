package controller.messaging;

import jakarta.websocket.server.ServerEndpointConfig;
import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.HandshakeResponse;
import jakarta.servlet.http.HttpSession;

public class HttpSessionConfigurator extends ServerEndpointConfig.Configurator {
    @Override
    public void modifyHandshake(ServerEndpointConfig config,
                                HandshakeRequest request,
                                HandshakeResponse response) {
        if (config == null) {
            // throw new IllegalArgumentException("ServerEndpointConfig cannot be null");
        }
        if (request == null) {
            // throw new IllegalArgumentException("HandshakeRequest cannot be null");
        }
        
        HttpSession httpSession = (HttpSession) request.getHttpSession();
        if (httpSession != null) {
            config.getUserProperties().put(HttpSession.class.getName(), httpSession);
        }
    }
}
