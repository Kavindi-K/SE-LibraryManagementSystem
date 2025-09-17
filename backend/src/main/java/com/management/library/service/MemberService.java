package com.management.library.service;

import com.management.library.model.Member;
import com.management.library.model.MembershipType;
import com.management.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepository;

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(String id) {
        return memberRepository.findById(id);
    }

    public Optional<Member> getMemberByEmail(String email) {
        return memberRepository.findByEmail(email);
    }

    public Member saveMember(Member member) {
        // Set timestamps
        if (member.getId() == null) {
            member.setCreatedAt(LocalDateTime.now());
            member.setMembershipStartDate(LocalDateTime.now());

            // Set membership end date based on type
            try {
                MembershipType type = MembershipType.valueOf(member.getMembershipType());
                member.setMembershipEndDate(
                    member.getMembershipStartDate().plusYears(type.getDurationYears())
                );
            } catch (IllegalArgumentException e) {
                // Default to 1 year if invalid membership type
                member.setMembershipEndDate(member.getMembershipStartDate().plusYears(1));
            }
        }
        member.setUpdatedAt(LocalDateTime.now());

        return memberRepository.save(member);
    }

    public Member updateMember(String id, Member memberDetails) {
        Optional<Member> optionalMember = memberRepository.findById(id);
        if (optionalMember.isPresent()) {
            Member member = optionalMember.get();

            member.setFirstName(memberDetails.getFirstName());
            member.setLastName(memberDetails.getLastName());
            member.setEmail(memberDetails.getEmail());
            member.setPhone(memberDetails.getPhone());
            member.setAddress(memberDetails.getAddress());
            member.setDateOfBirth(memberDetails.getDateOfBirth());
            member.setMembershipType(memberDetails.getMembershipType());
            member.setActive(memberDetails.isActive()); // Fixed: Changed from setIsActive to setActive
            member.setUpdatedAt(LocalDateTime.now());

            // Update membership end date if membership type changed
            try {
                MembershipType type = MembershipType.valueOf(member.getMembershipType());
                if (!member.getMembershipType().equals(memberDetails.getMembershipType())) {
                    member.setMembershipEndDate(
                        member.getMembershipStartDate().plusYears(type.getDurationYears())
                    );
                }
            } catch (IllegalArgumentException e) {
                // Keep existing end date if invalid membership type
            }

            return memberRepository.save(member);
        }
        throw new RuntimeException("Member not found with id: " + id);
    }

    public void deleteMember(String id) {
        memberRepository.deleteById(id);
    }

    public List<Member> searchMembers(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllMembers();
        }
        return memberRepository.searchMembers(searchTerm.trim());
    }

    public List<Member> getMembersByType(String membershipType) {
        return memberRepository.findByMembershipType(membershipType);
    }

    public List<Member> getActiveMembers() {
        return memberRepository.findByIsActive(true);
    }

    public boolean existsByEmail(String email) {
        return memberRepository.findByEmail(email).isPresent();
    }

    public MembershipType[] getAllMembershipTypes() {
        return MembershipType.values();
    }
}
