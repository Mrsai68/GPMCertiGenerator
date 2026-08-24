package com.gpm.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendWelcomeEmail(String toEmail, String studentName, String username) {

        if (javaMailSender == null) {
            System.out.println(">>> SMTP javaMailSender not configured. Skipping welcome email to " + toEmail);
            return;
        }

        try{

            MimeMessage msg =javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Smart Bonafide Certificate Portal | GPM");

            String html =  "<div style='font-family: Arial, sans-serif; padding: 20px; color: #1e293b;'>" +
                    "<h2 style='color: #2563eb;'>Welcome to Smart Bonafide Portal | GPM</h2>" +
                    "<p>Dear <strong>" + studentName + "</strong>,</p>" +
                    "<p>Your student profile has been registered successfully!</p>" +
                    "<p><strong>Username:</strong> " + username + "</p>" +
                    "<p>You can now log in to request digital Bonafide certificates and track approval status in real-time.</p>" +
                    "<br><p>Best Regards,<br>GOVERNMENT POLYTECHNIC MIRAJ</p>" +
                    "</div>";

            helper.setText(html,true);
            javaMailSender.send(msg);
            System.out.println("Welcome Msg succesfully sent to "+ toEmail);

        } catch(Exception e){
            System.err.println("Failed to send Email "+ e.getMessage());
        }
    }

    public void sendPasswordResetOtpEmail(String toEmail, String otpCode) {

        if (javaMailSender == null) {
            System.out.println(">>> SMTP javaMailSender not configured. Skipping OTP email to " + toEmail + " (OTP Code: " + otpCode + ")");
            return;
        }

        try{

            MimeMessage msg = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset Password OTP code - Smart BOnafide Portal | GPM");

            String html = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #1e293b;'>" +
                    "<h2 style='color: #2563eb;'>Password Reset Verification Code</h2>" +
                    "<p>Your 6-digit OTP code for password recovery is:</p>" +
                    "<div style='font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #1e40af; margin: 15px 0; padding: 10px; background: #e0effe; width: fit-content; border-radius: 8px;'>" + otpCode + "</div>" +
                    "<p>This code is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>" +
                    "<br><p>Best Regards,<br>Smart Bonafide Portal | GPM</p>" +
                    "</div>";

            helper.setText(html, true);
            javaMailSender.send(msg);
            System.out.println(">>> Password reset OTP email sent to " + toEmail);

        } catch (Exception e){
            System.err.println("Failed to send Email "+ e.getMessage());
        }
    }


    @Async
    public void sendCertificateRejectionEmail(String toEmail, String studentName, String purpose, String remarks) {
        if (javaMailSender == null) {
            System.out.println(">>> SMTP javaMailSender not configured. Skipping rejection email to " + toEmail);
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("UPDATE: Bonafide Certificate Application Status");

            String html = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #1e293b;'>" +
                    "<h2 style='color: #dc2626;'>Certificate Application Status Update</h2>" +
                    "<p>Dear <strong>" + studentName + "</strong>,</p>" +
                    "<p>Your application for <strong>" + purpose + "</strong> Bonafide Certificate was reviewed and was not approved.</p>" +
                    "<p><strong>Remarks / Reason:</strong> " + remarks + "</p>" +
                    "<p>You may submit a fresh request with corrected details from your student portal.</p>" +
                    "<br><p>Best Regards,<br>Academic Administration Office</p>" +
                    "</div>";

            helper.setText(html, true);
            javaMailSender.send(message);
            System.out.println(">>> Rejection email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send rejection email: " + e.getMessage());
        }
    }

    @Async
    public void sendCertificateApprovalEmail(String toEmail, String studentName, String purpose, String certNo, byte[] pdfBytes) {
        if (javaMailSender == null) {
            System.out.println(">>> SMTP MailSender not configured. Skipping certificate email to " + toEmail);
            return;
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("APPROVED: Bonafide Certificate (" + certNo + ")");

            String html = "<div style='font-family: Arial, sans-serif; padding: 20px; color: #1e293b;'>" +
                    "<h2 style='color: #16a34a;'>Bonafide Certificate Approved!</h2>" +
                    "<p>Dear <strong>" + studentName + "</strong>,</p>" +
                    "<p>Your application for <strong>" + purpose + "</strong> Bonafide Certificate has been approved by the Head of Department.</p>" +
                    "<p><strong>Certificate Ref No:</strong> " + certNo + "</p>" +
                    "<p>The official digital PDF with embedded anti-tamper QR code is attached to this email.</p>" +
                    "<br><p>Best Regards,<br>Academic Administration Office</p>" +
                    "</div>";

            helper.setText(html, true);
            helper.addAttachment("Bonafide_Certificate_" + certNo + ".pdf", new ByteArrayResource(pdfBytes));

            javaMailSender.send(message);
            System.out.println(">>> Certificate approval email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send approval email: " + e.getMessage());
        }
    }

}
