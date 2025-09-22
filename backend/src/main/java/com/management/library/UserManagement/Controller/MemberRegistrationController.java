package com.management.library.UserManagement.Controller;

import com.management.library.UserManagement.Dto.ApiResponse;
import com.management.library.MemberManagement.Entity.Member;
import com.management.library.MemberManagement.Dto.MemberResponse;
import com.management.library.UserManagement.Entity.User;
import com.management.library.UserManagement.Service.EmailService;
import com.management.library.MemberManagement.Service.MemberService;
import com.management.library.UserManagement.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5175")
public class MemberRegistrationController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.name:NexaLibrary}")
    private String appName;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<MemberResponse>> registerMember(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            String membershipType = (String) request.get("membershipType");

            if (userId == null || membershipType == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User ID and membership type are required"));
            }

            // Check if user exists
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();

            // Check if user is already a member
            try {
                MemberResponse existingMember = memberService.getMemberByUserId(userId);
                if (existingMember != null) {
                    return ResponseEntity.badRequest()
                        .body(ApiResponse.error("User is already a member"));
                }
            } catch (Exception e) {
                // Member not found, which is good - we can proceed
            }

            // Create member using the existing createMemberFromUser method
            MemberResponse memberResponse = memberService.createMemberFromUser(
                userId, 
                user.getFirstName(), 
                user.getLastName(), 
                user.getEmail()
            );

            // Send welcome email with membershipType
            try {
                emailService.sendMemberWelcomeEmail(
                    user.getEmail(), 
                    user.getFirstName(), 
                    memberResponse.getMemberId(), 
                    memberResponse.getMembershipType().toString()
                );
            } catch (Exception e) {
                // Log email error but don't fail the registration
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }

            return ResponseEntity.ok(ApiResponse.success("Member registration successful", memberResponse));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> loginWithMemberId(@RequestBody Map<String, String> request) {
        try {
            String memberId = request.get("memberId");
            String password = request.get("password");

            if (memberId == null || password == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Member ID and password are required"));
            }

            // Get member by member ID
            MemberResponse memberResponse = memberService.getMemberByMemberId(memberId.trim().toUpperCase());
            if (memberResponse == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid member ID"));
            }

            // Get user details using userId from member
            Optional<User> userOptional = userRepository.findById(memberResponse.getUserId());
            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("User account not found"));
            }

            User user = userOptional.get();

            // Check if member is active
            if (memberResponse.getStatus() != Member.MemberStatus.ACTIVE) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Member account is not active"));
            }

            Map<String, Object> loginData = Map.of(
                "userId", user.getId(),
                "memberId", memberResponse.getMemberId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "membershipType", memberResponse.getMembershipType()
            );

            return ResponseEntity.ok(ApiResponse.success("Login successful", loginData));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<ApiResponse<MemberResponse>> getMemberProfile(@PathVariable String userId) {
        try {
            MemberResponse member = memberService.getMemberByUserId(userId);
            if (member == null) {
                return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Member not found"));
            }

            return ResponseEntity.ok(ApiResponse.success("Member profile retrieved", member));
        } catch (com.management.library.UserManagement.Exception.ResourceNotFoundException e) {
            // User is not a member yet - return proper not found response
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error("Member not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Failed to retrieve profile: " + e.getMessage()));
        }
    }
}