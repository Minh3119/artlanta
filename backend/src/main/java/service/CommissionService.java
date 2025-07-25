package service;

import dal.CommissionDAO;
import dto.CommissionDTO;
import util.JsonUtil;

import java.sql.SQLException;
import java.util.*;

import org.json.JSONObject;
import org.json.JSONArray;
import dal.CommissionHistoryDAO;
import model.CommissionHistory;

public class CommissionService {
    private static final String STATUS_CANCELLED = "CANCELLED";

    public JSONObject cancelCommission(int commissionId, int userId) {
        CommissionDAO commissionDAO = new CommissionDAO();
        try {
            // First check if the commission exists and user has access
            CommissionDTO commission = commissionDAO.getCommissionByIdAndUser(commissionId, userId);
            if (commission == null) return null;

            // Only allow cancellation if commission is not already completed or cancelled
            if ("COMPLETED".equals(commission.getStatus()) || STATUS_CANCELLED.equals(commission.getStatus())) {
                return null;
            }

            // Update commission status to cancelled
            boolean updated = commissionDAO.updateCommissionStatus(commissionId, STATUS_CANCELLED);
            if (!updated) return null;

            // Return updated commission
            commission = commissionDAO.getCommissionByIdAndUser(commissionId, userId);
            return new JSONObject(JsonUtil.toJsonString(commission));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        } finally {
            commissionDAO.closeConnection();
        }
    }

    public CommissionService() {}

    public JSONObject getCommissionsByUserId(int userId, String status) {
        List<CommissionDTO> comms = new ArrayList<>();
        CommissionDAO commissionDAO = new CommissionDAO();
        try {
            comms = commissionDAO.getCommissionsWithRequestAndUserByUserId(userId, status);
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
    // Update the old method for backward compatibility
    public JSONObject getCommissionsByUserId(int userId) {
        return getCommissionsByUserId(userId, null);
    }

    public JSONObject getCommissionById(int commissionId, int userId) {
        CommissionDAO commissionDAO = new CommissionDAO();
        try {
            CommissionDTO dto = commissionDAO.getCommissionByIdAndUser(commissionId, userId);
            if (dto == null) return null;
            // Convert to JSON
            JSONObject jsonResponse = new JSONObject();
            jsonResponse.put("success", true);
            jsonResponse.put("commission", new JSONObject(util.JsonUtil.toJsonString(dto)));
            return jsonResponse;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            commissionDAO.closeConnection();
        }
        return null;
    }

    public JSONArray getCommissionHistory(int commissionId) {
        CommissionHistoryDAO historyDAO = new CommissionHistoryDAO();
        try {
            List<CommissionHistory> historyList = historyDAO.getHistoryByCommissionId(commissionId);
            return new JSONArray(JsonUtil.toJsonString(historyList));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            historyDAO.closeConnection();
        }
        return new JSONArray();
    }

    public JSONObject updateCommission(int commissionId, int userId, String title, String description, double price) {
        CommissionDAO commissionDAO = new CommissionDAO();
        try {
            boolean updated = commissionDAO.updateCommission(commissionId, userId, title, description, price);
            if (!updated) return null;
            CommissionDTO dto = commissionDAO.getCommissionByIdAndUser(commissionId, userId);
            if (dto == null) return null;
            return new JSONObject(util.JsonUtil.toJsonString(dto));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            commissionDAO.closeConnection();
        }
        return null;
    }

    public JSONObject submitCommission(int commissionId, int userId, String fileDeliveryURL, String previewImageURL) {
        CommissionDAO commissionDAO = new CommissionDAO();
        try {
            boolean updated = commissionDAO.submitCommission(commissionId, userId, fileDeliveryURL, previewImageURL);
            if (!updated) return null;
            CommissionDTO dto = commissionDAO.getCommissionByIdAndUser(commissionId, userId);
            if (dto == null) return null;
            return new JSONObject(util.JsonUtil.toJsonString(dto));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            commissionDAO.closeConnection();
        }
        return null;
    }

    public JSONObject confirmCommissionByClient(int commissionId, int clientId) {
        CommissionDAO commissionDAO = new CommissionDAO();
        try {
            boolean updated = commissionDAO.confirmCommissionByClient(commissionId, clientId);
            if (!updated) return null;
            CommissionDTO dto = commissionDAO.getCommissionByIdAndUser(commissionId, clientId);
            if (dto == null) return null;
            return new JSONObject(util.JsonUtil.toJsonString(dto));
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            commissionDAO.closeConnection();
        }
        return null;
    }
}