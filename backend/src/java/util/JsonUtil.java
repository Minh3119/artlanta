package util;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import org.json.JSONObject;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;

import java.time.LocalDateTime;

import java.io.BufferedReader;

public class JsonUtil {
	private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDateTime.class, new LocalDateTimeAdapter())
            .create();

    public static <T> T fromJsonString(String json, Class<T> clazz) throws JsonSyntaxException {
        return gson.fromJson(json, clazz);
    }

    public static String toJsonString(Object obj) {
        return gson.toJson(obj);
    }

	public static void writeJsonResponse(HttpServletResponse response, JSONObject jsonObject) throws IOException {
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		out.write(jsonObject.toString());
		out.flush();
	}

	// New one
	public static void writeJsonError(HttpServletResponse response, String errorMessage, int statusCode) throws IOException {
        response.setStatus(statusCode);
        JSONObject json = new JSONObject();
        json.put("success", false);
        json.put("error", errorMessage);
        writeJsonResponse(response, json);
    }
    
    // Old one, Overloaded method for backward compatibility
    public static void writeJsonError(HttpServletResponse response, String errorMessage) throws IOException {
        writeJsonError(response, errorMessage, HttpServletResponse.SC_BAD_REQUEST);
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
