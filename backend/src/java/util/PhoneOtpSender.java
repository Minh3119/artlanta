/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import validation.EnvConfig;

public class PhoneOtpSender {
    public static String sendOtp(String phone, String otp) {
        EnvConfig configReader = new EnvConfig();
        String apiKey = configReader.getProperty("APIKeySMS");
        
        try {
            SpeedSMSAPI api = new SpeedSMSAPI(apiKey);

            String message = "Ma OTP cua ban la: " + otp;
            int type = 2;           // 2 = OTP
            String sender = "";    

            return api.sendSMS(phone, message, type, sender);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"status\":\"error\", \"message\":\"" + e.getMessage() + "\"}";
        }
    }
}
