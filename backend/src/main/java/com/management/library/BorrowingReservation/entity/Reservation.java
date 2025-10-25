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
@Document("reservations")
public class Reservation {
    @Id
    private String id;
    private String reservationNumber; // RSYYYY####
    private String memberId;
    private String bookId;
    private LocalDate reservationDate;
    private String status; // PENDING, RECEIVED, CANCELLED
}



