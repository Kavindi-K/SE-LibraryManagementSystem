package com.management.library.MemberManagement.Controller;

import com.management.library.MemberManagement.Dto.*;
import com.management.library.MemberManagement.Entity.Member;
import com.management.library.MemberManagement.Service.MemberService;
import com.management.library.UserManagement.Dto.ApiResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    private static final Logger log = LoggerFactory.getLogger(MemberController.class);
    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> createMember(@Valid @RequestBody CreateMemberRequest request) {
        log.info("Creating member with email: {}", request.getEmail());

        try {
            MemberResponse memberResponse = memberService.createMember(request);
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    true,
                    "Member created successfully",
                    memberResponse
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error creating member: {}", e.getMessage());
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    false,
                    "Error creating member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/auto-create")
    public ResponseEntity<ApiResponse<MemberResponse>> createMemberFromUser(
            @RequestParam String userId,
            @RequestParam String firstName,
            @RequestParam String lastName,
            @RequestParam String email) {
        log.info("Auto-creating member for user: {}", userId);

        try {
            MemberResponse memberResponse = memberService.createMemberFromUser(userId, firstName, lastName, email);
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    true,
                    "Member created automatically for user",
                    memberResponse
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Error auto-creating member: {}", e.getMessage());
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    false,
                    "Error auto-creating member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MemberResponse>> getMemberById(@PathVariable String id) {
        log.info("Getting member by ID: {}", id);

        try {
            MemberResponse memberResponse = memberService.getMemberById(id);
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    true,
                    "Member retrieved successfully",
                    memberResponse
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting member: {}", e.getMessage());
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    false,
                    "Error getting member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/member-id/{memberId}")
    public ResponseEntity<ApiResponse<MemberResponse>> getMemberByMemberId(@PathVariable String memberId) {
        log.info("Getting member by member ID: {}", memberId);

        try {
            MemberResponse memberResponse = memberService.getMemberByMemberId(memberId);
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    true,
                    "Member retrieved successfully",
                    memberResponse
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting member: {}", e.getMessage());
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    false,
                    "Error getting member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<MemberResponse>> getMemberByUserId(@PathVariable String userId) {
        log.info("Getting member by user ID: {}", userId);

        try {
            MemberResponse memberResponse = memberService.getMemberByUserId(userId);
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    true,
                    "Member retrieved successfully",
                    memberResponse
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting member: {}", e.getMessage());
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    false,
                    "Error getting member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getAllMembers() {
        log.info("Getting all members");

        try {
            List<MemberResponse> members = memberService.getAllMembers();
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    true,
                    "Members retrieved successfully",
                    members
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting members: {}", e.getMessage());
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    false,
                    "Error getting members: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/membership-type/{membershipType}")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getMembersByMembershipType(
            @PathVariable Member.MembershipType membershipType) {
        log.info("Getting members by membership type: {}", membershipType);

        try {
            List<MemberResponse> members = memberService.getMembersByMembershipType(membershipType);
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    true,
                    "Members retrieved successfully",
                    members
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting members by membership type: {}", e.getMessage());
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    false,
                    "Error getting members: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getMembersByStatus(
            @PathVariable Member.MemberStatus status) {
        log.info("Getting members by status: {}", status);

        try {
            List<MemberResponse> members = memberService.getMembersByStatus(status);
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    true,
                    "Members retrieved successfully",
                    members
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting members by status: {}", e.getMessage());
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    false,
                    "Error getting members: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> searchMembers(@RequestParam String query) {
        log.info("Searching members with query: {}", query);

        try {
            List<MemberResponse> members = memberService.searchMembers(query);
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    true,
                    "Members search completed successfully",
                    members
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error searching members: {}", e.getMessage());
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    false,
                    "Error searching members: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MemberResponse>> updateMember(
            @PathVariable String id,
            @Valid @RequestBody UpdateMemberRequest request) {
        log.info("Updating member with ID: {}", id);

        try {
            MemberResponse memberResponse = memberService.updateMember(id, request);
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    true,
                    "Member updated successfully",
                    memberResponse
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error updating member: {}", e.getMessage());
            ApiResponse<MemberResponse> response = new ApiResponse<>(
                    false,
                    "Error updating member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMember(@PathVariable String id) {
        log.info("Deleting member with ID: {}", id);

        try {
            memberService.deleteMember(id);
            ApiResponse<Void> response = new ApiResponse<>(
                    true,
                    "Member deleted successfully",
                    null
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error deleting member: {}", e.getMessage());
            ApiResponse<Void> response = new ApiResponse<>(
                    false,
                    "Error deleting member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<ApiResponse<Void>> suspendMember(@PathVariable String id) {
        log.info("Suspending member with ID: {}", id);

        try {
            memberService.suspendMember(id);
            ApiResponse<Void> response = new ApiResponse<>(
                    true,
                    "Member suspended successfully",
                    null
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error suspending member: {}", e.getMessage());
            ApiResponse<Void> response = new ApiResponse<>(
                    false,
                    "Error suspending member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<Void>> activateMember(@PathVariable String id) {
        log.info("Activating member with ID: {}", id);

        try {
            memberService.activateMember(id);
            ApiResponse<Void> response = new ApiResponse<>(
                    true,
                    "Member activated successfully",
                    null
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error activating member: {}", e.getMessage());
            ApiResponse<Void> response = new ApiResponse<>(
                    false,
                    "Error activating member: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // Statistics endpoints for dashboard
    @GetMapping("/stats/total")
    public ResponseEntity<ApiResponse<Long>> getTotalMembersCount() {
        log.info("Getting total members count");

        try {
            long count = memberService.getTotalMembersCount();
            ApiResponse<Long> response = new ApiResponse<>(
                    true,
                    "Total members count retrieved successfully",
                    count
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting total members count: {}", e.getMessage());
            ApiResponse<Long> response = new ApiResponse<>(
                    false,
                    "Error getting total members count: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/stats/membership-type/{membershipType}")
    public ResponseEntity<ApiResponse<Long>> getMemberCountByMembershipType(
            @PathVariable Member.MembershipType membershipType) {
        log.info("Getting member count by membership type: {}", membershipType);

        try {
            long count = memberService.getMemberCountByMembershipType(membershipType);
            ApiResponse<Long> response = new ApiResponse<>(
                    true,
                    "Member count retrieved successfully",
                    count
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting member count by membership type: {}", e.getMessage());
            ApiResponse<Long> response = new ApiResponse<>(
                    false,
                    "Error getting member count: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/stats/status/{status}")
    public ResponseEntity<ApiResponse<Long>> getMemberCountByStatus(@PathVariable Member.MemberStatus status) {
        log.info("Getting member count by status: {}", status);

        try {
            long count = memberService.getMemberCountByStatus(status);
            ApiResponse<Long> response = new ApiResponse<>(
                    true,
                    "Member count retrieved successfully",
                    count
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting member count by status: {}", e.getMessage());
            ApiResponse<Long> response = new ApiResponse<>(
                    false,
                    "Error getting member count: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/expiring")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getMembersExpiringBefore(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        log.info("Getting members expiring before: {}", date);

        try {
            List<MemberResponse> members = memberService.getMembersExpiringBefore(date);
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    true,
                    "Expiring members retrieved successfully",
                    members
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting expiring members: {}", e.getMessage());
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    false,
                    "Error getting expiring members: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/with-fines")
    public ResponseEntity<ApiResponse<List<MemberResponse>>> getMembersWithFines() {
        log.info("Getting members with fines");

        try {
            List<MemberResponse> members = memberService.getMembersWithFines();
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    true,
                    "Members with fines retrieved successfully",
                    members
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting members with fines: {}", e.getMessage());
            ApiResponse<List<MemberResponse>> response = new ApiResponse<>(
                    false,
                    "Error getting members with fines: " + e.getMessage(),
                    null
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}