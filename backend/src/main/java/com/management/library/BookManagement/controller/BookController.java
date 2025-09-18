package com.management.library.BookManagement.controller;

import com.management.library.BookManagement.DTO.BookRequestDto;
import com.management.library.BookManagement.DTO.BookResponseDto;
import com.management.library.BookManagement.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow all origins for now
public class BookController {

    private final BookService bookService;

    // Create a new book
    @PostMapping
    public ResponseEntity<BookResponseDto> createBook(@Valid @RequestBody BookRequestDto bookRequestDto) {
        BookResponseDto createdBook = bookService.createBook(bookRequestDto);
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<BookResponseDto>> getAllBooks() {
        List<BookResponseDto> books = bookService.getAllBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDto> getBookById(@PathVariable String id) {
        Optional<BookResponseDto> book = bookService.getBookById(id);
        return book.map(bookResponseDto -> new ResponseEntity<>(bookResponseDto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update book
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDto> updateBook(@PathVariable String id,
                                                      @Valid @RequestBody BookRequestDto bookRequestDto) {
        Optional<BookResponseDto> updatedBook = bookService.updateBook(id, bookRequestDto);
        return updatedBook.map(bookResponseDto -> new ResponseEntity<>(bookResponseDto, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete book
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        boolean deleted = bookService.deleteBook(id);
        return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Search books by title
    @GetMapping("/search/title")
    public ResponseEntity<List<BookResponseDto>> searchBooksByTitle(@RequestParam String title) {
        List<BookResponseDto> books = bookService.searchBooksByTitle(title);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Search books by author
    @GetMapping("/search/author")
    public ResponseEntity<List<BookResponseDto>> searchBooksByAuthor(@RequestParam String author) {
        List<BookResponseDto> books = bookService.searchBooksByAuthor(author);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Search books by genre
    @GetMapping("/search/genre")
    public ResponseEntity<List<BookResponseDto>> searchBooksByGenre(@RequestParam String genre) {
        List<BookResponseDto> books = bookService.searchBooksByGenre(genre);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Get available books
    @GetMapping("/available")
    public ResponseEntity<List<BookResponseDto>> getAvailableBooks() {
        List<BookResponseDto> books = bookService.getAvailableBooks();
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Search books by year
    @GetMapping("/search/year")
    public ResponseEntity<List<BookResponseDto>> searchBooksByYear(@RequestParam Integer year) {
        List<BookResponseDto> books = bookService.searchBooksByYear(year);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Search books by language
    @GetMapping("/search/language")
    public ResponseEntity<List<BookResponseDto>> searchBooksByLanguage(@RequestParam String language) {
        List<BookResponseDto> books = bookService.searchBooksByLanguage(language);
        return new ResponseEntity<>(books, HttpStatus.OK);
    }
}