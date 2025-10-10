package com.management.library.MemberManagement.Service;

import com.management.library.MemberManagement.Dto.*;
import com.management.library.MemberManagement.Entity.Member;
import com.management.library.MemberManagement.Repository.MemberRepository;
import com.management.library.UserManagement.Exception.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MemberService {

    private static final Logger log = LoggerFactory.getLogger(MemberService.class);
    private final MemberRepository memberRepository;

    // Constructor
    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public MemberResponse createMember(CreateMemberRequest request) {
        log.info("Creating member with email: {}", request.getEmail());

        // Check if email already exists
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Member with email already exists: " + request.getEmail());
        }

        // Generate unique member ID
        String memberId = generateMemberId();

        Member member = new Member();
        member.setMemberId(memberId);
        member.setUserId(request.getUserId());
        member.setFirstName(request.getFirstName());
        member.setLastName(request.getLastName());
        member.setEmail(request.getEmail());
        member.setPhoneNumber(request.getPhoneNumber());
        member.setAddress(request.getAddress());
        member.setEmergencyContact(request.getEmergencyContact());
        member.setMembershipType(request.getMembershipType());
        member.setJoiningDate(request.getJoiningDate() != null ? request.getJoiningDate() : LocalDate.now());
        member.setExpiryDate(request.getExpiryDate() != null ? request.getExpiryDate() : calculateExpiryDate(member.getJoiningDate()));
        member.setStatus(request.getStatus());
        member.setBorrowingLimit(calculateBorrowingLimit(request.getMembershipType()));
        member.setFineAmount(0.0);
        member.setProfilePictureUrl(request.getProfilePictureUrl());
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());

        Member savedMember = memberRepository.save(member);
        log.info("Member created successfully with ID: {}", savedMember.getMemberId());

        return MemberResponse.fromEntity(savedMember);
    }

    public MemberResponse createMemberFromUser(String userId, String firstName, String lastName, String email) {
        return createMemberFromUser(userId, firstName, lastName, email, Member.MembershipType.BASIC);
    }

    public MemberResponse createMemberFromUser(String userId, String firstName, String lastName, String email, Member.MembershipType membershipType) {
        log.info("Auto-creating member for user: {} with membership type: {}", userId, membershipType);

        // Check if member already exists for this user
        if (memberRepository.existsByUserId(userId)) {
            Optional<Member> existingMember = memberRepository.findByUserId(userId);
            return existingMember.map(MemberResponse::fromEntity).orElse(null);
        }

        CreateMemberRequest request = new CreateMemberRequest();
        request.setUserId(userId);
        request.setFirstName(firstName);
        request.setLastName(lastName);
        request.setEmail(email);
        request.setMembershipType(membershipType); // Use the provided membership type
        request.setStatus(Member.MemberStatus.ACTIVE);

        return createMember(request);
    }

    public MemberResponse getMemberById(String id) {
        log.info("Fetching member with ID: {}", id);

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + id));

        return MemberResponse.fromEntity(member);
    }

    public MemberResponse getMemberByMemberId(String memberId) {
        log.info("Fetching member with member ID: {}", memberId);

        // Handle potential duplicates by finding the most recent active member
        List<Member> members = memberRepository.findAllByMemberId(memberId);
        
        if (members.isEmpty()) {
            throw new ResourceNotFoundException("Member not found with member ID: " + memberId);
        }
        
        // If multiple members exist, prioritize active members and get the most recent one
        Member member = members.stream()
                .filter(m -> m.getStatus() == Member.MemberStatus.ACTIVE)
                .findFirst()
                .orElse(members.get(0)); // Fallback to first member if no active member found

        return MemberResponse.fromEntity(member);
    }

    public MemberResponse getMemberByUserId(String userId) {
        log.info("Fetching member for user ID: {}", userId);

        Member member = memberRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found for user ID: " + userId));

        return MemberResponse.fromEntity(member);
    }

    public List<MemberResponse> getAllMembers() {
        log.info("Fetching all members");

        List<Member> members = memberRepository.findAll();
        return members.stream()
                .map(MemberResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MemberResponse> getMembersByMembershipType(Member.MembershipType membershipType) {
        log.info("Fetching members with membership type: {}", membershipType);

        List<Member> members = memberRepository.findByMembershipType(membershipType);
        return members.stream()
                .map(MemberResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MemberResponse> getMembersByStatus(Member.MemberStatus status) {
        log.info("Fetching members with status: {}", status);

        List<Member> members = memberRepository.findByStatus(status);
        return members.stream()
                .map(MemberResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MemberResponse> searchMembers(String query) {
        log.info("Searching members with query: {}", query);

        List<Member> members = memberRepository.findBySearchQuery(query);
        return members.stream()
                .map(MemberResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public MemberResponse updateMember(String id, UpdateMemberRequest request) {
        log.info("Updating member with ID: {}", id);

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + id));

        // Update fields if provided
        if (request.getFirstName() != null) {
            member.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            member.setLastName(request.getLastName());
        }
        if (request.getEmail() != null && !request.getEmail().equals(member.getEmail())) {
            if (memberRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Email already exists: " + request.getEmail());
            }
            member.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            member.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            member.setAddress(request.getAddress());
        }
        if (request.getEmergencyContact() != null) {
            member.setEmergencyContact(request.getEmergencyContact());
        }
        if (request.getMembershipType() != null) {
            member.setMembershipType(request.getMembershipType());
            member.setBorrowingLimit(calculateBorrowingLimit(request.getMembershipType()));
        }
        if (request.getExpiryDate() != null) {
            member.setExpiryDate(request.getExpiryDate());
        }
        if (request.getStatus() != null) {
            member.setStatus(request.getStatus());
        }
        if (request.getBorrowingLimit() > 0) {
            member.setBorrowingLimit(request.getBorrowingLimit());
        }
        if (request.getFineAmount() >= 0) {
            member.setFineAmount(request.getFineAmount());
        }
        if (request.getProfilePictureUrl() != null) {
            member.setProfilePictureUrl(request.getProfilePictureUrl());
        }

        member.setUpdatedAt(LocalDateTime.now());

        Member updatedMember = memberRepository.save(member);
        log.info("Member updated successfully with ID: {}", updatedMember.getMemberId());

        return MemberResponse.fromEntity(updatedMember);
    }

    public void deleteMember(String id) {
        log.info("Deleting member with ID: {}", id);

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + id));

        memberRepository.delete(member);
        log.info("Member deleted successfully with ID: {}", member.getMemberId());
    }

    public void suspendMember(String id) {
        log.info("Suspending member with ID: {}", id);

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + id));

        member.setStatus(Member.MemberStatus.SUSPENDED);
        member.setUpdatedAt(LocalDateTime.now());

        memberRepository.save(member);
        log.info("Member suspended successfully with ID: {}", member.getMemberId());
    }

    public void activateMember(String id) {
        log.info("Activating member with ID: {}", id);

        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with ID: " + id));

        member.setStatus(Member.MemberStatus.ACTIVE);
        member.setUpdatedAt(LocalDateTime.now());

        memberRepository.save(member);
        log.info("Member activated successfully with ID: {}", member.getMemberId());
    }

    // Utility methods
    private String generateMemberId() {
        long count = memberRepository.count();
        return String.format("LIB2025%03d", count + 1);
    }

    private LocalDate calculateExpiryDate(LocalDate joiningDate) {
        return joiningDate.plusYears(1); // Default 1 year membership
    }

    private int calculateBorrowingLimit(Member.MembershipType membershipType) {
        switch (membershipType) {
            case BASIC:
                return 3;
            case PREMIUM:
                return 10;
            case STUDENT:
                return 5;
            case FAMILY:
                return 15;
            default:
                return 3;
        }
    }

    // Statistics methods
    public long getTotalMembersCount() {
        return memberRepository.count();
    }

    public long getMemberCountByMembershipType(Member.MembershipType membershipType) {
        return memberRepository.countByMembershipType(membershipType);
    }

    public long getMemberCountByStatus(Member.MemberStatus status) {
        return memberRepository.countByStatus(status);
    }

    public List<MemberResponse> getMembersExpiringBefore(LocalDate date) {
        List<Member> members = memberRepository.findMembersExpiringBefore(date);
        return members.stream()
                .map(MemberResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<MemberResponse> getMembersWithFines() {
        List<Member> members = memberRepository.findMembersWithFines();
        return members.stream()
                .map(MemberResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
