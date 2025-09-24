package com.management.library.MemberManagement.Dto;

import com.management.library.MemberManagement.Entity.Member;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class MemberResponse {

    private String id;
    private String memberId;
    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private String emergencyContact;
    private Member.MembershipType membershipType;
    private LocalDate joiningDate;
    private LocalDate expiryDate;
    private Member.MemberStatus status;
    private int borrowingLimit;
    private double fineAmount;
    private String profilePictureUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public MemberResponse() {
    }

    // All args constructor
    public MemberResponse(String id, String memberId, String userId, String firstName, String lastName,
                          String email, String phoneNumber, String address, String emergencyContact,
                          Member.MembershipType membershipType, LocalDate joiningDate, LocalDate expiryDate,
                          Member.MemberStatus status, int borrowingLimit, double fineAmount,
                          String profilePictureUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.memberId = memberId;
        this.userId = userId;
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
        this.fineAmount = fineAmount;
        this.profilePictureUrl = profilePictureUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Static factory method
    public static MemberResponse fromEntity(Member member) {
        return new MemberResponse(
                member.getId(),
                member.getMemberId(),
                member.getUserId(),
                member.getFirstName(),
                member.getLastName(),
                member.getEmail(),
                member.getPhoneNumber(),
                member.getAddress(),
                member.getEmergencyContact(),
                member.getMembershipType(),
                member.getJoiningDate(),
                member.getExpiryDate(),
                member.getStatus(),
                member.getBorrowingLimit(),
                member.getFineAmount(),
                member.getProfilePictureUrl(),
                member.getCreatedAt(),
                member.getUpdatedAt()
        );
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
}