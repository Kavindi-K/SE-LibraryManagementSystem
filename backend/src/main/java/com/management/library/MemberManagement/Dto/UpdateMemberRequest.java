package com.management.library.MemberManagement.Dto;

import com.management.library.MemberManagement.Entity.Member;
import jakarta.validation.constraints.Email;
import java.time.LocalDate;

public class UpdateMemberRequest {

    private String firstName;
    private String lastName;

    @Email(message = "Email should be valid")
    private String email;

    private String phoneNumber;
    private String address;
    private String emergencyContact;
    private Member.MembershipType membershipType;
    private LocalDate expiryDate;
    private Member.MemberStatus status;
    private int borrowingLimit;
    private double fineAmount;
    private String profilePictureUrl;

    // Default constructor
    public UpdateMemberRequest() {
    }

    // All args constructor
    public UpdateMemberRequest(String firstName, String lastName, String email, String phoneNumber,
                               String address, String emergencyContact, Member.MembershipType membershipType,
                               LocalDate expiryDate, Member.MemberStatus status, int borrowingLimit,
                               double fineAmount, String profilePictureUrl) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.membershipType = membershipType;
        this.expiryDate = expiryDate;
        this.status = status;
        this.borrowingLimit = borrowingLimit;
        this.fineAmount = fineAmount;
        this.profilePictureUrl = profilePictureUrl;
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

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public Member.MemberStatus getStatus() {
        return status;
    }

    public int getBorrowingLimit() {
        return borrowingLimit;
    }

    public double getFineAmount() {
        return fineAmount;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
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

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setStatus(Member.MemberStatus status) {
        this.status = status;
    }

    public void setBorrowingLimit(int borrowingLimit) {
        this.borrowingLimit = borrowingLimit;
    }

    public void setFineAmount(double fineAmount) {
        this.fineAmount = fineAmount;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }
}