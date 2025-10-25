package com.management.library.BorrowingReservation.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("borrowings")
public class Borrowing {
    @Id
    private String id;
    private String borrowingNumber; // BRYYYY####
    private String memberId;
    private String bookId;
    private LocalDate borrowDate;
    private LocalDate dueDate;
    private LocalDate returnDate; // nullable
    private String status; // ACTIVE or RETURNED
    private int lateFee;
}



