package com.management.library.BookManagement.service;

import com.management.library.BookManagement.DTO.BookRequestDto;
import com.management.library.BookManagement.DTO.BookResponseDto;
import com.management.library.BookManagement.model.Book;
import com.management.library.BookManagement.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    // Create a new book
    public BookResponseDto createBook(BookRequestDto bookRequestDto) {
        Book book = new Book();
        mapRequestDtoToEntity(bookRequestDto, book);
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());

        Book savedBook = bookRepository.save(book);
        return mapEntityToResponseDto(savedBook);
    }

    // Get all books
    public List<BookResponseDto> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    // Get book by ID
    public Optional<BookResponseDto> getBookById(String id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.map(this::mapEntityToResponseDto);
    }

    // Update book
    public Optional<BookResponseDto> updateBook(String id, BookRequestDto bookRequestDto) {
        Optional<Book> existingBook = bookRepository.findById(id);

        if (existingBook.isPresent()) {
            Book book = existingBook.get();
            mapRequestDtoToEntity(bookRequestDto, book);
            book.setUpdatedAt(LocalDateTime.now());

            Book updatedBook = bookRepository.save(book);
            return Optional.of(mapEntityToResponseDto(updatedBook));
        }

        return Optional.empty();
    }

    // Delete book
    public boolean deleteBook(String id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Search books by title
    public List<BookResponseDto> searchBooksByTitle(String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        return books.stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    // Search books by author
    public List<BookResponseDto> searchBooksByAuthor(String author) {
        List<Book> books = bookRepository.findByAuthorContainingIgnoreCase(author);
        return books.stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    // Search books by genre
    public List<BookResponseDto> searchBooksByGenre(String genre) {
        List<Book> books = bookRepository.findByGenreIgnoreCase(genre);
        return books.stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    // Get available books
    public List<BookResponseDto> getAvailableBooks() {
        List<Book> books = bookRepository.findByAvailabilityTrue();
        return books.stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    // Search books by year
    public List<BookResponseDto> searchBooksByYear(Integer year) {
        List<Book> books = bookRepository.findByYear(year);
        return books.stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    // Search books by language
    public List<BookResponseDto> searchBooksByLanguage(String language) {
        List<Book> books = bookRepository.findByLanguageIgnoreCase(language);
        return books.stream()
                .map(this::mapEntityToResponseDto)
                .collect(Collectors.toList());
    }

    // Helper method to map RequestDto to Entity
    private void mapRequestDtoToEntity(BookRequestDto dto, Book entity) {
        entity.setTitle(dto.getTitle());
        entity.setAuthor(dto.getAuthor());
        entity.setGenre(dto.getGenre());
        entity.setYear(dto.getYear());
        entity.setEdition(dto.getEdition());
        entity.setDescription(dto.getDescription());
        entity.setLanguage(dto.getLanguage());
        entity.setAvailability(dto.getAvailability());
        entity.setAvailableCopies(dto.getAvailableCopies());
        entity.setLocation(dto.getLocation());
    }

    // Helper method to map Entity to ResponseDto
    private BookResponseDto mapEntityToResponseDto(Book entity) {
        return new BookResponseDto(
                entity.getId(),
                entity.getTitle(),
                entity.getAuthor(),
                entity.getGenre(),
                entity.getYear(),
                entity.getEdition(),
                entity.getDescription(),
                entity.getLanguage(),
                entity.getAvailability(),
                entity.getAvailableCopies(),
                entity.getLocation(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}