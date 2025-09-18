package com.management.library.UserManagement.Dto;

import com.management.library.UserManagement.Entity.User;
import jakarta.validation.constraints.Email;
import java.time.LocalDate;

public class UpdateUserRequest {

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

    // Getters
    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUsername() {
        return username;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public String getAddress() {
        return address;
    }

    public User.UserStatus getStatus() {
        return status;
    }

    public User.UserRole getRole() {
        return role;
    }

    // Setters
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setStatus(User.UserStatus status) {
        this.status = status;
    }

    public void setRole(User.UserRole role) {
        this.role = role;
    }
}