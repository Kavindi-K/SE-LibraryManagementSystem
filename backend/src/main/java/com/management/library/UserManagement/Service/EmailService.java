package com.management.library.UserManagement.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendMemberWelcomeEmail(String toEmail, String memberName, String memberId, String membershipType) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to NexaLibrary University Library - Your Membership Details");

            String htmlContent = createMemberWelcomeEmailTemplate(memberName, memberId, membershipType);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Member welcome email sent successfully to: " + toEmail);

        } catch (MessagingException e) {
            System.err.println("Failed to send member welcome email: " + e.getMessage());
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            System.out.println("Simple email sent successfully to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Failed to send simple email: " + e.getMessage());
            throw new RuntimeException("Failed to send email", e);
        }
    }

    private String createMemberWelcomeEmailTemplate(String memberName, String memberId, String membershipType) {
        String currentDate = java.time.LocalDate.now().toString();
        
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html>");
        html.append("<html>");
        html.append("<head>");
        html.append("<meta charset='UTF-8'>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }");
        html.append(".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }");
        html.append(".content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }");
        html.append(".member-id { background: #e3f2fd; border: 2px solid #2196f3; padding: 15px; text-align: center; border-radius: 8px; font-size: 18px; font-weight: bold; color: #1976d2; margin: 20px 0; }");
        html.append(".membership-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }");
        html.append(".pricing-table { width: 100%; border-collapse: collapse; margin: 15px 0; }");
        html.append(".pricing-table th, .pricing-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }");
        html.append(".pricing-table th { background-color: #f5f5f5; font-weight: bold; }");
        html.append(".your-plan { background-color: #e8f5e8; font-weight: bold; }");
        html.append(".benefits { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }");
        html.append(".benefits ul { padding-left: 20px; }");
        html.append(".benefits li { margin: 8px 0; }");
        html.append(".footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }");
        html.append("</style>");
        html.append("</head>");
        html.append("<body>");
        
        html.append("<div class='header'>");
        html.append("<h1>🎉 Welcome to NexaLibrary University Library!</h1>");
        html.append("<p>Your membership has been successfully activated</p>");
        html.append("</div>");
        
        html.append("<div class='content'>");
        html.append("<h2>Dear ").append(memberName).append(",</h2>");
        html.append("<p>Congratulations! You are now an official member of the NexaLibrary University Library. We're excited to have you join our community of learners and knowledge seekers.</p>");
        
        html.append("<div class='member-id'>");
        html.append("<strong>Your Member ID: ").append(memberId).append("</strong>");
        html.append("<br><small>Keep this ID safe - you'll need it to access your member profile</small>");
        html.append("</div>");
        
        html.append("<div class='membership-details'>");
        html.append("<h3>Your Membership Details</h3>");
        html.append("<p><strong>Membership Type:</strong> ").append(membershipType).append("</p>");
        html.append("<p><strong>Status:</strong> Active</p>");
        html.append("<p><strong>Registration Date:</strong> ").append(currentDate).append("</p>");
        html.append("</div>");
        
        html.append("<div class='membership-details'>");
        html.append("<h3>All Membership Types & Pricing</h3>");
        html.append("<table class='pricing-table'>");
        html.append("<tr><th>Membership Type</th><th>Monthly Fee</th><th>Features</th></tr>");
        
        html.append("<tr").append(membershipType.equals("BASIC") ? " class='your-plan'" : "").append(">");
        html.append("<td>Basic</td><td>$10/month</td><td>Standard borrowing, Basic digital access</td></tr>");
        
        html.append("<tr").append(membershipType.equals("PREMIUM") ? " class='your-plan'" : "").append(">");
        html.append("<td>Premium</td><td>$25/month</td><td>Extended borrowing, Full digital access, Priority support</td></tr>");
        
        html.append("<tr").append(membershipType.equals("STUDENT") ? " class='your-plan'" : "").append(">");
        html.append("<td>Student</td><td>$5/month</td><td>Student discount, Academic resources</td></tr>");
        
        html.append("<tr").append(membershipType.equals("FAMILY") ? " class='your-plan'" : "").append(">");
        html.append("<td>Family</td><td>$40/month</td><td>Up to 4 family members, Shared benefits</td></tr>");
        
        html.append("<tr").append(membershipType.equals("FACULTY") ? " class='your-plan'" : "").append(">");
        html.append("<td>Faculty</td><td>$15/month</td><td>Research access, Teaching resources</td></tr>");
        
        html.append("<tr").append(membershipType.equals("REGULAR") ? " class='your-plan'" : "").append(">");
        html.append("<td>Regular</td><td>$20/month</td><td>Standard access, Regular borrowing limits</td></tr>");
        
        html.append("</table>");
        html.append("</div>");
        
        html.append("<div class='benefits'>");
        html.append("<h3>Your Membership Benefits</h3>");
        html.append("<ul>");
        html.append("<li>📚 Extended borrowing periods (up to 14 days)</li>");
        html.append("<li>💻 Access to premium digital resources and e-books</li>");
        html.append("<li>🔍 Priority book reservations</li>");
        html.append("<li>🏫 Study room booking privileges</li>");
        html.append("<li>🎓 Research assistance services</li>");
        html.append("<li>📱 Mobile app access for catalog browsing</li>");
        html.append("<li>🔔 Email notifications for due dates and new arrivals</li>");
        html.append("<li>📊 Personal reading history and recommendations</li>");
        html.append("</ul>");
        html.append("</div>");
        
        html.append("<div style='text-align: center;'>");
        html.append("<p><strong>Ready to explore our library?</strong></p>");
        html.append("<p>Use your Member ID to access your profile and start borrowing books today!</p>");
        html.append("</div>");
        
        html.append("<div class='membership-details'>");
        html.append("<h3>Library Information</h3>");
        html.append("<p><strong>Location:</strong> NexaLibrary Campus, New Kandy Road, Malabe, Sri Lanka</p>");
        html.append("<p><strong>Phone:</strong> +94 11 754 4801</p>");
        html.append("<p><strong>Email:</strong> library@nexalibrary.lk</p>");
        html.append("<p><strong>Hours:</strong></p>");
        html.append("<ul>");
        html.append("<li>Monday - Friday: 8:00 AM - 10:00 PM</li>");
        html.append("<li>Saturday: 9:00 AM - 8:00 PM</li>");
        html.append("<li>Sunday: 10:00 AM - 6:00 PM</li>");
        html.append("</ul>");
        html.append("</div>");
        html.append("</div>");
        
        html.append("<div class='footer'>");
        html.append("<p>Thank you for choosing NexaLibrary University Library!</p>");
        html.append("<p>If you have any questions, please don't hesitate to contact us.</p>");
        html.append("<p>&copy; 2025 NexaLibrary University Library. All rights reserved.</p>");
        html.append("</div>");
        
        html.append("</body>");
        html.append("</html>");
        
        return html.toString();
    }
}