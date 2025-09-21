package com.management.library.BorrowingReservation.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.management.library.BorrowingReservation.entity.Borrowing;

public interface BorrowingRepository extends MongoRepository<Borrowing, String> {
    boolean existsByBorrowingNumber(String borrowingNumber);
}



