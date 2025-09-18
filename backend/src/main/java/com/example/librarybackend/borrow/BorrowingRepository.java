package com.example.librarybackend.borrow;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BorrowingRepository extends MongoRepository<Borrowing, String> {
    boolean existsByBorrowingNumber(String borrowingNumber);
}



