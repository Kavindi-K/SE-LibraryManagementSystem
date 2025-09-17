package com.management.library.UserManagement.Dto;

import com.management.library.UserManagement.Entity.User;
import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class UpdateUserRequest {

    // Setters
    // Getters
    private String firstName;
    private String lastName;
    private String username;
    private LocalDate dateOfBirth;

    @Email(message = "Email should be valid")
    private String email;

    private String address;
    private User.UserStatus status;
    private User.UserRole role;

    // Default constructor
    public UpdateUserRequest() {
    }

    // All args constructor
    public UpdateUserRequest(String firstName, String lastName, String username, LocalDate dateOfBirth,
                             String email, String address, User.UserStatus status, User.UserRole role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.address = address;
        this.status = status;
        this.role = role;
    }

}