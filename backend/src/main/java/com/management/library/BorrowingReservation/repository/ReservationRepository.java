package com.management.library.BorrowingReservation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.management.library.BorrowingReservation.entity.Reservation;

public interface ReservationRepository extends MongoRepository<Reservation, String> {
}



