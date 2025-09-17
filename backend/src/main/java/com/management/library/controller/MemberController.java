package com.management.library.controller;

import com.management.library.model.Member;
import com.management.library.model.MembershipType;
import com.management.library.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
public class MemberController {

    @Autowired
    private MemberService memberService;

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("Backend is running! Member API is healthy.", HttpStatus.OK);
    }

    // Fix: Handle both with and without trailing slash
    @GetMapping(value = {"", "/"})
    public ResponseEntity<List<Member>> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable String id) {
        Optional<Member> member = memberService.getMemberById(id);
        return member.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                     .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<?> createMember(@RequestBody Member member) {
        try {
            // Check if email already exists
            if (memberService.existsByEmail(member.getEmail())) {
                return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
            }

            Member savedMember = memberService.saveMember(member);
            return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating member: " + e.getMessage(),
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMember(@PathVariable String id, @RequestBody Member memberDetails) {
        try {
            // Check if email is being changed to an existing email
            Optional<Member> existingMember = memberService.getMemberById(id);
            if (existingMember.isPresent()) {
                if (!existingMember.get().getEmail().equals(memberDetails.getEmail()) &&
                    memberService.existsByEmail(memberDetails.getEmail())) {
                    return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
                }
            }

            Member updatedMember = memberService.updateMember(id, memberDetails);
            return new ResponseEntity<>(updatedMember, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating member: " + e.getMessage(),
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMember(@PathVariable String id) {
        try {
            Optional<Member> member = memberService.getMemberById(id);
            if (member.isPresent()) {
                memberService.deleteMember(id);
                return new ResponseEntity<>("Member deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Member not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting member: " + e.getMessage(),
                                      HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Member>> searchMembers(@RequestParam String q) {
        List<Member> members = memberService.searchMembers(q);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    @GetMapping("/type/{membershipType}")
    public ResponseEntity<List<Member>> getMembersByType(@PathVariable String membershipType) {
        List<Member> members = memberService.getMembersByType(membershipType);
        return new ResponseEntity<>(members, HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Member>> getActiveMembers() {
        List<Member> activeMembers = memberService.getActiveMembers();
        return new ResponseEntity<>(activeMembers, HttpStatus.OK);
    }

    @GetMapping("/membership-types")
    public ResponseEntity<MembershipType[]> getMembershipTypes() {
        MembershipType[] types = memberService.getAllMembershipTypes();
        return new ResponseEntity<>(types, HttpStatus.OK);
    }
}
