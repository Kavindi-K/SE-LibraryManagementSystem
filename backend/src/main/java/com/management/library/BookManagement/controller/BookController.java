package com.management.library.BookManagement.controller;

import com.management.library.BookManagement.DTO.BookRequestDTO;
import com.management.library.BookManagement.model.Book;
import com.management.library.BookManagement.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Add a new book
    @PostMapping
    public ResponseEntity<Book> addBook(@Valid @RequestBody BookRequestDTO bookRequestDTO) {
        try {
            Book savedBook = bookService.addBook(bookRequestDTO.toEntity());
            return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        try {
            List<Book> books = bookService.getAllBooks();
            if (books.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable String id) {
        try {
            Optional<Book> book = bookService.getBookById(id);
            return book.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update book details
    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable String id,
            @Valid @RequestBody BookRequestDTO bookRequestDTO) {
        try {
            if (!bookService.bookExists(id)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            Book updatedBook = bookService.updateBook(id, bookRequestDTO.toEntity());
            if (updatedBook != null) {
                return new ResponseEntity<>(updatedBook, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a book
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable String id) {
        try {
            boolean deleted = bookService.deleteBook(id);
            if (deleted) {
                return new ResponseEntity<>("Book deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting book", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get total number of books
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalBooks() {
        try {
            long count = bookService.getTotalBooks();
            return new ResponseEntity<>(count, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update book availability
    @PatchMapping("/{id}/availability")
    public ResponseEntity<Book> updateBookAvailability(
            @PathVariable String id,
            @RequestParam Boolean available,
            @RequestParam(required = false) String borrower) {
        try {
            Optional<Book> bookOpt = bookService.getBookById(id);
            if (bookOpt.isPresent()) {
                Book book = new Book();
                book.setAvailability(available);
                if (borrower != null) {
                    book.setBorrower(borrower);
                }

                Book updatedBook = bookService.updateBook(id, book);
                return new ResponseEntity<>(updatedBook, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
