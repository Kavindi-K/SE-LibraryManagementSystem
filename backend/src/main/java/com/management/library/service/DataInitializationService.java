package com.management.library.service;

import com.management.library.model.Member;
import com.management.library.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private MemberRepository memberRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Only initialize data if the collection is empty
            if (memberRepository.count() == 0) {
                System.out.println("Initializing sample member data...");
                initializeSampleMembers();
                System.out.println("Sample member data initialized successfully!");
            } else {
                System.out.println("Member data already exists. Skipping initialization.");
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not initialize sample data - " + e.getMessage());
            // Don't throw the exception to prevent application startup failure
        }
    }

    private void initializeSampleMembers() {
        // Create sample members
        Member member1 = new Member();
        member1.setFirstName("John");
        member1.setLastName("Doe");
        member1.setEmail("john.doe@email.com");
        member1.setPhone("+1-555-0101");
        member1.setAddress("123 Main St, Anytown, AN 12345");
        member1.setDateOfBirth(LocalDate.of(1990, 5, 15));
        member1.setMembershipType("STUDENT");
        member1.setActive(true); // Changed from setIsActive to setActive
        member1.setFineAmount(0.0);
        member1.setCreatedAt(LocalDateTime.now().minusDays(30));
        member1.setUpdatedAt(LocalDateTime.now().minusDays(30));
        member1.setMembershipStartDate(LocalDateTime.now().minusDays(30));
        member1.setMembershipEndDate(LocalDateTime.now().minusDays(30).plusYears(1));

        Member member2 = new Member();
        member2.setFirstName("Jane");
        member2.setLastName("Smith");
        member2.setEmail("jane.smith@university.edu");
        member2.setPhone("+1-555-0102");
        member2.setAddress("456 Oak Ave, College Town, CT 67890");
        member2.setDateOfBirth(LocalDate.of(1975, 8, 22));
        member2.setMembershipType("FACULTY");
        member2.setActive(true); // Changed from setIsActive to setActive
        member2.setFineAmount(2.50);
        member2.setCreatedAt(LocalDateTime.now().minusDays(60));
        member2.setUpdatedAt(LocalDateTime.now().minusDays(5));
        member2.setMembershipStartDate(LocalDateTime.now().minusDays(60));
        member2.setMembershipEndDate(LocalDateTime.now().minusDays(60).plusYears(2));

        Member member3 = new Member();
        member3.setFirstName("Bob");
        member3.setLastName("Johnson");
        member3.setEmail("bob.johnson@gmail.com");
        member3.setPhone("+1-555-0103");
        member3.setAddress("789 Pine Rd, Suburbia, SB 11111");
        member3.setDateOfBirth(LocalDate.of(1985, 12, 10));
        member3.setMembershipType("REGULAR");
        member3.setActive(true); // Changed from setIsActive to setActive
        member3.setFineAmount(0.0);
        member3.setCreatedAt(LocalDateTime.now().minusDays(15));
        member3.setUpdatedAt(LocalDateTime.now().minusDays(15));
        member3.setMembershipStartDate(LocalDateTime.now().minusDays(15));
        member3.setMembershipEndDate(LocalDateTime.now().minusDays(15).plusYears(1));

        Member member4 = new Member();
        member4.setFirstName("Alice");
        member4.setLastName("Wilson");
        member4.setEmail("alice.wilson@premium.com");
        member4.setPhone("+1-555-0104");
        member4.setAddress("321 Elm St, Uptown, UT 22222");
        member4.setDateOfBirth(LocalDate.of(1988, 3, 5));
        member4.setMembershipType("PREMIUM");
        member4.setActive(true); // Changed from setIsActive to setActive
        member4.setFineAmount(0.0);
        member4.setCreatedAt(LocalDateTime.now().minusDays(45));
        member4.setUpdatedAt(LocalDateTime.now().minusDays(45));
        member4.setMembershipStartDate(LocalDateTime.now().minusDays(45));
        member4.setMembershipEndDate(LocalDateTime.now().minusDays(45).plusYears(2));

        Member member5 = new Member();
        member5.setFirstName("Charlie");
        member5.setLastName("Brown");
        member5.setEmail("charlie.brown@student.edu");
        member5.setPhone("+1-555-0105");
        member5.setAddress("654 Maple Dr, Campus, CP 33333");
        member5.setDateOfBirth(LocalDate.of(1998, 7, 18));
        member5.setMembershipType("STUDENT");
        member5.setActive(false); // Changed from setIsActive to setActive
        member5.setFineAmount(15.75);
        member5.setCreatedAt(LocalDateTime.now().minusDays(90));
        member5.setUpdatedAt(LocalDateTime.now().minusDays(10));
        member5.setMembershipStartDate(LocalDateTime.now().minusDays(90));
        member5.setMembershipEndDate(LocalDateTime.now().minusDays(90).plusYears(1));

        // Save all sample members
        memberRepository.save(member1);
        memberRepository.save(member2);
        memberRepository.save(member3);
        memberRepository.save(member4);
        memberRepository.save(member5);
    }
}
