package com.management.library.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "members")
public class Member {
    @Id
    private String id;

    @Indexed
    private String firstName;

    @Indexed
    private String lastName;

    @Indexed(unique = true)
    private String email;

    @Indexed
    private String phone;

    private String address;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String membershipType; // STUDENT, FACULTY, REGULAR, PREMIUM

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime membershipStartDate;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime membershipEndDate;

    private boolean isActive;

    private double fineAmount;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // Constructor for creating new members
    public Member(String firstName, String lastName, String email, String phone,
                  String address, LocalDate dateOfBirth, String membershipType) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.dateOfBirth = dateOfBirth;
        this.membershipType = membershipType;
        this.isActive = true;
        this.fineAmount = 0.0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.membershipStartDate = LocalDateTime.now();
        // Set membership end date based on type (can be customized)
        this.membershipEndDate = LocalDateTime.now().plusYears(1);
    }
}
