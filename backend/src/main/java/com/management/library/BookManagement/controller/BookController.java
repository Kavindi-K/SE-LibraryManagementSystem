package com.management.library.BookManagement.controller;

import com.management.library.BookManagement.dto.*;
import com.management.library.BookManagement.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    // Create a new book
    @PostMapping
    public ResponseEntity<BookResponseDTO> createBook(@Valid @RequestBody BookCreateDTO bookCreateDTO) {
        try {
            BookResponseDTO createdBook = bookService.createBook(bookCreateDTO);
            return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getAllBooks() {
        try {
            List<BookResponseDTO> books = bookService.getAllBooks();
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable String id) {
        try {
            Optional<BookResponseDTO> book = bookService.getBookById(id);
            return book.map(bookResponseDTO -> new ResponseEntity<>(bookResponseDTO, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update book
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> updateBook(@PathVariable String id,
                                                      @Valid @RequestBody BookUpdateDTO bookUpdateDTO) {
        try {
            Optional<BookResponseDTO> updatedBook = bookService.updateBook(id, bookUpdateDTO);
            return updatedBook.map(bookResponseDTO -> new ResponseEntity<>(bookResponseDTO, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    // Delete book
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable String id) {
        try {
            boolean deleted = bookService.deleteBook(id);
            return deleted ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                    : new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get books by availability
    @GetMapping("/availability/{availability}")
    public ResponseEntity<List<BookResponseDTO>> getBooksByAvailability(@PathVariable Boolean availability) {
        try {
            List<BookResponseDTO> books = bookService.getBooksByAvailability(availability);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search books by author
    @GetMapping("/search/author")
    public ResponseEntity<List<BookResponseDTO>> searchBooksByAuthor(@RequestParam String author) {
        try {
            List<BookResponseDTO> books = bookService.searchBooksByAuthor(author);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search books by title
    @GetMapping("/search/title")
    public ResponseEntity<List<BookResponseDTO>> searchBooksByTitle(@RequestParam String title) {
        try {
            List<BookResponseDTO> books = bookService.searchBooksByTitle(title);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search books by genre
    @GetMapping("/search/genre")
    public ResponseEntity<List<BookResponseDTO>> searchBooksByGenre(@RequestParam String genre) {
        try {
            List<BookResponseDTO> books = bookService.searchBooksByGenre(genre);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Search books by multiple criteria
    @GetMapping("/search")
    public ResponseEntity<List<BookResponseDTO>> searchBooks(@RequestParam String query) {
        try {
            List<BookResponseDTO> books = bookService.searchBooks(query);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get books by language
    @GetMapping("/language/{language}")
    public ResponseEntity<List<BookResponseDTO>> getBooksByLanguage(@PathVariable String language) {
        try {
            List<BookResponseDTO> books = bookService.getBooksByLanguage(language);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get books by year
    @GetMapping("/year/{year}")
    public ResponseEntity<List<BookResponseDTO>> getBooksByYear(@PathVariable Integer year) {
        try {
            List<BookResponseDTO> books = bookService.getBooksByYear(year);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get books by location
    @GetMapping("/location/{location}")
    public ResponseEntity<List<BookResponseDTO>> getBooksByLocation(@PathVariable String location) {
        try {
            List<BookResponseDTO> books = bookService.getBooksByLocation(location);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get book statistics
    @GetMapping("/stats")
    public ResponseEntity<BookStatsDTO> getBookStatistics() {
        try {
            BookStatsDTO stats = bookService.getBookStatistics();
            return new ResponseEntity<>(stats, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get books with available copies
    @GetMapping("/available-copies")
    public ResponseEntity<List<BookResponseDTO>> getBooksWithAvailableCopies() {
        try {
            List<BookResponseDTO> books = bookService.getBooksWithAvailableCopies();
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get books by year range
    @GetMapping("/year-range")
    public ResponseEntity<List<BookResponseDTO>> getBooksByYearRange(@RequestParam Integer startYear,
                                                                     @RequestParam Integer endYear) {
        try {
            List<BookResponseDTO> books = bookService.getBooksByYearRange(startYear, endYear);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get books with minimum copies
    @GetMapping("/minimum-copies")
    public ResponseEntity<List<BookResponseDTO>> getBooksWithMinimumCopies(@RequestParam Integer minCopies) {
        try {
            List<BookResponseDTO> books = bookService.getBooksWithMinimumCopies(minCopies);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}