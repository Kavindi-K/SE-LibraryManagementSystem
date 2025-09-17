package com.management.library.BookManagement.repository;

import com.management.library.BookManagement.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookRepository extends MongoRepository<Book, String> {
}

