package com.management.library.UserManagement.Controller;

import com.management.library.UserManagement.Dto.*;
import com.management.library.UserManagement.Entity.User;
import com.management.library.UserManagement.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    // Manual constructor (replaces @RequiredArgsConstructor)
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("POST /api/users - Creating user with username: {}", request.getUsername());

        UserResponse userResponse = userService.createUser(request);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                true,
                "User created successfully",
                userResponse
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<UserResponse>> loginUser(@Valid @RequestBody LoginRequest request) {
        log.info("POST /api/users/login - Login attempt for username: {}", request.getUsername());

        UserResponse userResponse = userService.loginUser(request);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                true,
                "Login successful",
                userResponse
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        log.info("GET /api/users/{} - Fetching user by ID", id);

        UserResponse userResponse = userService.getUserById(id);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                true,
                "User retrieved successfully",
                userResponse
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByUsername(@PathVariable String username) {
        log.info("GET /api/users/username/{} - Fetching user by username", username);

        UserResponse userResponse = userService.getUserByUsername(username);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                true,
                "User retrieved successfully",
                userResponse
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
        log.info("GET /api/users/email/{} - Fetching user by email", email);

        UserResponse userResponse = userService.getUserByEmail(email);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                true,
                "User retrieved successfully",
                userResponse
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        log.info("GET /api/users - Fetching all users");

        List<UserResponse> users = userService.getAllUsers();
        ApiResponse<List<UserResponse>> response = new ApiResponse<>(
                true,
                "Users retrieved successfully",
                users
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getUsersByStatus(@PathVariable User.UserStatus status) {
        log.info("GET /api/users/status/{} - Fetching users by status", status);

        List<UserResponse> users = userService.getUsersByStatus(status);
        ApiResponse<List<UserResponse>> response = new ApiResponse<>(
                true,
                "Users retrieved successfully",
                users
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserResponse>>> searchUsers(@RequestParam String query) {
        log.info("GET /api/users/search?query={} - Searching users", query);

        List<UserResponse> users = userService.searchUsers(query);
        ApiResponse<List<UserResponse>> response = new ApiResponse<>(
                true,
                "Search completed successfully",
                users
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable String id,
            @Valid @RequestBody UpdateUserRequest request) {
        log.info("PUT /api/users/{} - Updating user", id);

        UserResponse userResponse = userService.updateUser(id, request);
        ApiResponse<UserResponse> response = new ApiResponse<>(
                true,
                "User updated successfully",
                userResponse
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @PathVariable String id,
            @Valid @RequestBody ChangePasswordRequest request) {
        log.info("PUT /api/users/{}/change-password - Changing user password", id);

        userService.changePassword(id, request);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Password changed successfully",
                null
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<String>> activateUser(@PathVariable String id) {
        log.info("PUT /api/users/{}/activate - Activating user", id);

        userService.activateUser(id);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "User activated successfully",
                null
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<ApiResponse<String>> deactivateUser(@PathVariable String id) {
        log.info("PUT /api/users/{}/deactivate - Deactivating user", id);

        userService.deactivateUser(id);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "User deactivated successfully",
                null
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable String id) {
        log.info("DELETE /api/users/{} - Deleting user", id);

        userService.deleteUser(id);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "User deleted successfully",
                null
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStats() {
        log.info("GET /api/users/stats - Fetching user statistics");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userService.getAllUsers().size());
        stats.put("activeUsers", userService.getUserCountByStatus(User.UserStatus.ACTIVATED));
        stats.put("deactivatedUsers", userService.getUserCountByStatus(User.UserStatus.DEACTIVATED));

        ApiResponse<Map<String, Object>> response = new ApiResponse<>(
                true,
                "User statistics retrieved successfully",
                stats
        );

        return ResponseEntity.ok(response);
    }
}