/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package util;

import jakarta.mail.*;
import jakarta.mail.internet.*;
import jakarta.servlet.ServletContext;
import java.util.Properties;
import validation.EnvConfig;

/**
 *
 * @author anhkt
 */
public class MailSender {

    public static boolean sendEmail(String userEmail, String otpNumber, ServletContext context) {
        try {
            EnvConfig configReader = new EnvConfig();
            
            String host = configReader.getProperty("smtp.host");
            String port = configReader.getProperty("smtp.port");
            String gmailAppPass = configReader.getProperty("smtp.password");
            String emailSender = configReader.getProperty("smtp.username");
            
            Properties props = new Properties();
            props.put("mail.smtp.host", host);
            props.put("mail.smtp.port", port);
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(emailSender, gmailAppPass);
                }
            });
            
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(emailSender));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(userEmail));
            
            message.setSubject("Your OTP Code");
            message.setText("Your OTP code is: " + otpNumber);

            Transport.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

    }
}
