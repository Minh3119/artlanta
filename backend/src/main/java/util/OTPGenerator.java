/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import java.security.SecureRandom;

public class OTPGenerator {
    public static String generateOTP(int length) {
        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            otp.append(random.nextInt(10)); 
        }
        return otp.toString();
    }
}