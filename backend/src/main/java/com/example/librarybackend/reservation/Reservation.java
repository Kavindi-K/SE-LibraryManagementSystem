package com.example.librarybackend.reservation;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
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



