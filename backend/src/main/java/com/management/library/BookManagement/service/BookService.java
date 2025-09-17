package com.management.library.BookManagement.service;

import com.management.library.BookManagement.model.Book;
import com.management.library.BookManagement.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public Book addBook(Book book) {
        // Ensure timestamps are set
        if (book.getCreatedAt() == null) {
            book.setCreatedAt(LocalDateTime.now());
        }
        book.setUpdatedAt(LocalDateTime.now());
        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }

    // Fixed: Better null handling and method name consistency
    public Book updateBook(String id, Book updatedBook) {
        return bookRepository.findById(id).map(book -> {
            // Update only non-null fields
            if (updatedBook.getTitle() != null) {
                book.setTitle(updatedBook.getTitle());
            }
            if (updatedBook.getAuthors() != null) {
                book.setAuthors(updatedBook.getAuthors());
            }
            if (updatedBook.getGenres() != null) {
                book.setGenres(updatedBook.getGenres());
            }
            if (updatedBook.getYear() != null) {
                book.setYear(updatedBook.getYear());
            }
            if (updatedBook.getEdition() != null) {
                book.setEdition(updatedBook.getEdition());
            }
            if (updatedBook.getDescription() != null) {
                book.setDescription(updatedBook.getDescription());
            }
            if (updatedBook.getLanguage() != null) {
                book.setLanguage(updatedBook.getLanguage());
            }
            if (updatedBook.getAvailability() != null) {
                book.setAvailability(updatedBook.getAvailability());
            }
            if (updatedBook.getBorrower() != null) {
                book.setBorrower(updatedBook.getBorrower());
            }
            if (updatedBook.getAvailableCopies() != null) {
                book.setAvailableCopies(updatedBook.getAvailableCopies());
            }
            if (updatedBook.getLocation() != null) {
                book.setLocation(updatedBook.getLocation());
            }

            // Always update the timestamp
            book.setUpdatedAt(LocalDateTime.now());
            return bookRepository.save(book);
        }).orElse(null);
    }

    public boolean deleteBook(String id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Additional useful methods
    public boolean bookExists(String id) {
        return bookRepository.existsById(id);
    }

    public long getTotalBooks() {
        return bookRepository.count();
    }
}