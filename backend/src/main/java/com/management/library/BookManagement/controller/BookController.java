package com.management.library.BookManagement.controller;

import com.management.library.BookManagement.DTO.BookRequestDTO;
import com.management.library.BookManagement.DTO.BookResponseDTO;
import com.management.library.BookManagement.DTO.BookUpdateDTO;
import com.management.library.BookManagement.model.Book;
import com.management.library.BookManagement.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
    public ResponseEntity<?> addBook(@Valid @RequestBody BookRequestDTO bookRequestDTO, BindingResult bindingResult) {
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                List<String> errors = bindingResult.getAllErrors()
                        .stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.toList());
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            Book savedBook = bookService.addBook(bookRequestDTO.toEntity());
            BookResponseDTO response = convertToResponseDTO(savedBook);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating book: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get all books
    @GetMapping
    public ResponseEntity<List<BookResponseDTO>> getAllBooks() {
        try {
            List<Book> books = bookService.getAllBooks();
            if (books.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            List<BookResponseDTO> response = books.stream()
                    .map(this::convertToResponseDTO)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get book by ID
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable String id) {
        try {
            Optional<Book> book = bookService.getBookById(id);
            return book.map(value -> new ResponseEntity<>(convertToResponseDTO(value), HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Update book details
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(
            @PathVariable String id,
            @Valid @RequestBody BookUpdateDTO bookUpdateDTO,
            BindingResult bindingResult) {
        try {
            // Check for validation errors
            if (bindingResult.hasErrors()) {
                List<String> errors = bindingResult.getAllErrors()
                        .stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.toList());
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            if (!bookService.bookExists(id)) {
                return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
            }

            Book updatedBook = bookService.updateBook(id, convertUpdateDTOToEntity(bookUpdateDTO));
            if (updatedBook != null) {
                BookResponseDTO response = convertToResponseDTO(updatedBook);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating book: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
            return new ResponseEntity<>("Error deleting book: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
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
    public ResponseEntity<?> updateBookAvailability(
            @PathVariable String id,
            @RequestParam Boolean available,
            @RequestParam(required = false) String borrower) {
        try {
            Optional<Book> bookOpt = bookService.getBookById(id);
            if (bookOpt.isPresent()) {
                BookUpdateDTO updateDTO = new BookUpdateDTO();
                updateDTO.setAvailability(available);
                if (borrower != null && !borrower.trim().isEmpty()) {
                    updateDTO.setBorrower(borrower);
                }

                Book updatedBook = bookService.updateBook(id, convertUpdateDTOToEntity(updateDTO));
                BookResponseDTO response = convertToResponseDTO(updatedBook);
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Book not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating availability: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper method to convert Book entity to BookResponseDTO
    private BookResponseDTO convertToResponseDTO(Book book) {
        BookResponseDTO dto = new BookResponseDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthors(book.getAuthors());
        dto.setGenres(book.getGenres());
        dto.setYear(book.getYear());
        dto.setEdition(book.getEdition());
        dto.setDescription(book.getDescription());
        dto.setLanguage(book.getLanguage());
        dto.setAvailability(book.getAvailability());
        dto.setBorrower(book.getBorrower());
        dto.setAvailableCopies(book.getAvailableCopies());
        dto.setLocation(book.getLocation());
        dto.setCreatedAt(book.getCreatedAt());
        dto.setUpdatedAt(book.getUpdatedAt());
        return dto;
    }

    // Helper method to convert BookUpdateDTO to Book entity
    private Book convertUpdateDTOToEntity(BookUpdateDTO updateDTO) {
        Book book = new Book();
        book.setTitle(updateDTO.getTitle());
        book.setAuthors(updateDTO.getAuthors());
        book.setGenres(updateDTO.getGenres());
        book.setYear(updateDTO.getYear());
        book.setEdition(updateDTO.getEdition());
        book.setDescription(updateDTO.getDescription());
        book.setLanguage(updateDTO.getLanguage());
        book.setAvailability(updateDTO.getAvailability());
        book.setBorrower(updateDTO.getBorrower());
        book.setAvailableCopies(updateDTO.getAvailableCopies());
        book.setLocation(updateDTO.getLocation());
        return book;
    }
}