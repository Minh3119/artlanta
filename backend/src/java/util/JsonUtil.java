package util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import org.json.JSONObject;
import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;

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

	public static JSONObject parseRequestBody(HttpServletRequest request) throws IOException {
		StringBuilder buffer = new StringBuilder();
		String line;
		try (BufferedReader reader = request.getReader()) {
			while ((line = reader.readLine()) != null) {
				buffer.append(line);
			}
		}

		String data = buffer.toString();
		if (data == null || data.trim().isEmpty()) {
			return null;
		}

		try {
			return new JSONObject(data);
		} catch (Exception e) {
			return null;
		}
	}
}
