package com.management.library.MemberManagement.Dto;

import com.management.library.MemberManagement.Entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateMemberRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    private String phoneNumber;

    private String address;

    private String emergencyContact;

    @NotNull(message = "Membership type is required")
    private Member.MembershipType membershipType;

    private LocalDate joiningDate;

    private LocalDate expiryDate;

    private Member.MemberStatus status = Member.MemberStatus.ACTIVE;

    private int borrowingLimit;

    private String profilePictureUrl;

    // For linking to existing user
    private String userId;

    // Default constructor
    public CreateMemberRequest() {
    }

    // All args constructor
    public CreateMemberRequest(String firstName, String lastName, String email, String phoneNumber,
                               String address, String emergencyContact, Member.MembershipType membershipType,
                               LocalDate joiningDate, LocalDate expiryDate, Member.MemberStatus status,
                               int borrowingLimit, String userId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.membershipType = membershipType;
        this.joiningDate = joiningDate;
        this.expiryDate = expiryDate;
        this.status = status;
        this.borrowingLimit = borrowingLimit;
        this.userId = userId;
    }

    // Getters
    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public String getEmergencyContact() {
        return emergencyContact;
    }

    public Member.MembershipType getMembershipType() {
        return membershipType;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public Member.MemberStatus getStatus() {
        return status;
    }

    public int getBorrowingLimit() {
        return borrowingLimit;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public String getUserId() {
        return userId;
    }

    // Setters
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setEmergencyContact(String emergencyContact) {
        this.emergencyContact = emergencyContact;
    }

    public void setMembershipType(Member.MembershipType membershipType) {
        this.membershipType = membershipType;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setStatus(Member.MemberStatus status) {
        this.status = status;
    }

    public void setBorrowingLimit(int borrowingLimit) {
        this.borrowingLimit = borrowingLimit;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}