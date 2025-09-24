package com.management.library.MemberManagement.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "members")
public class Member {

    @Id
    private String id;

    @Indexed(unique = true)
    private String memberId; // Generated unique member ID (e.g., MEM001)

    private String userId; // Link to User entity

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String address;

    private String emergencyContact;

    private MembershipType membershipType = MembershipType.BASIC;

    private LocalDate joiningDate;

    private LocalDate expiryDate;

    private MemberStatus status = MemberStatus.ACTIVE;

    private int borrowingLimit = 3; // Default limit

    private double fineAmount = 0.0;

    private String profilePictureUrl;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // Constructors
    public Member() {
    }

    public Member(String memberId, String userId, String firstName, String lastName, String email,
                  String phoneNumber, String address, MembershipType membershipType, LocalDate joiningDate,
                  LocalDate expiryDate, MemberStatus status, int borrowingLimit) {
        this.memberId = memberId;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.membershipType = membershipType;
        this.joiningDate = joiningDate;
        this.expiryDate = expiryDate;
        this.status = status;
        this.borrowingLimit = borrowingLimit;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getMemberId() {
        return memberId;
    }

    public String getUserId() {
        return userId;
    }

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

    public MembershipType getMembershipType() {
        return membershipType;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public MemberStatus getStatus() {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

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

    public void setMembershipType(MembershipType membershipType) {
        this.membershipType = membershipType;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setStatus(MemberStatus status) {
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

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Enums
    public enum MembershipType {
        BASIC, PREMIUM, STUDENT, FAMILY, FACULTY, REGULAR
    }

    public enum MemberStatus {
        ACTIVE, EXPIRED, SUSPENDED, INACTIVE
    }
}