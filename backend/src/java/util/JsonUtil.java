package util;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import org.json.JSONObject;

public class JsonUtil {
	public static void writeJsonResponse(HttpServletResponse response, JSONObject jsonObject) throws IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		out.write(jsonObject.toString());
		out.flush();
	}

	public static void writeJsonError(HttpServletResponse response, String errorMessage) throws IOException {
		JSONObject json = new JSONObject();
		json.put("error", errorMessage);
		writeJsonResponse(response, json);
	}
}
