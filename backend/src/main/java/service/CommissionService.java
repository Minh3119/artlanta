package service;

import dal.CommissionDAO;
import dto.CommissionDTO;
import util.JsonUtil;

import java.sql.SQLException;
import java.util.*;

import org.json.JSONObject;
import org.json.JSONArray;

public class CommissionService {
    public CommissionService() {}

    public JSONObject getCommissionsByUserId(int userId) {
        List<CommissionDTO> comms = new ArrayList<>();
        CommissionDAO commissionDAO = new CommissionDAO();
        try {
            comms = commissionDAO.getCommissionsWithRequestAndUserByUserId(userId);
            
            // Convert commissions to JSON
            JSONObject jsonResponse = new JSONObject();
            JSONArray commsArray = new JSONArray(JsonUtil.toJsonString(comms));
        
            jsonResponse.put("success", true);
            jsonResponse.put("commissions", commsArray);

            return jsonResponse;
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            commissionDAO.closeConnection();
        }
        return null;
    }
} 