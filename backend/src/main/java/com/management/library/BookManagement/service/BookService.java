package com.management.library.BookManagement.service;

import com.management.library.BookManagement.dto.BookCreateDTO;
import com.management.library.BookManagement.dto.BookResponseDTO;
import com.management.library.BookManagement.dto.BookStatsDTO;
import com.management.library.BookManagement.dto.BookUpdateDTO;
import com.management.library.BookManagement.entity.Book;
import com.management.library.BookManagement.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Create a new book
    public BookResponseDTO createBook(BookCreateDTO bookCreateDTO) {
        Book book = new Book();
        book.setBookNo(bookCreateDTO.getBookNo());
        book.setTitle(bookCreateDTO.getTitle());
        book.setImage(bookCreateDTO.getImage());
        book.setAuthor(bookCreateDTO.getAuthor());
        book.setGenre(bookCreateDTO.getGenre());
        book.setYear(bookCreateDTO.getYear());
        book.setEdition(bookCreateDTO.getEdition());
        book.setDescription(bookCreateDTO.getDescription());
        book.setLanguage(bookCreateDTO.getLanguage());
        book.setAvailability(bookCreateDTO.getAvailability());
        book.setAvailableCopies(bookCreateDTO.getAvailableCopies());
        book.setLocation(bookCreateDTO.getLocation());
        book.setCreatedAt(LocalDateTime.now());
        book.setUpdatedAt(LocalDateTime.now());

        Book savedBook = bookRepository.save(book);
        return convertToResponseDTO(savedBook);
    }

    // Get all books
    public List<BookResponseDTO> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get book by ID
    public Optional<BookResponseDTO> getBookById(String id) {
        Optional<Book> book = bookRepository.findById(id);
        return book.map(this::convertToResponseDTO);
    }

    // Get book by book number
    public Optional<BookResponseDTO> getBookByBookNo(String bookNo) {
        Optional<Book> book = bookRepository.findByBookNo(bookNo);
        return book.map(this::convertToResponseDTO);
    }

    // Update book
    public Optional<BookResponseDTO> updateBook(String id, BookUpdateDTO bookUpdateDTO) {
        Optional<Book> existingBookOpt = bookRepository.findById(id);

        if (existingBookOpt.isPresent()) {
            Book existingBook = existingBookOpt.get();

            // Update only non-null fields
            if (bookUpdateDTO.getBookNo() != null) {
                existingBook.setBookNo(bookUpdateDTO.getBookNo());
            }
            if (bookUpdateDTO.getTitle() != null) {
                existingBook.setTitle(bookUpdateDTO.getTitle());
            }
            if (bookUpdateDTO.getImage() != null) {
                existingBook.setImage(bookUpdateDTO.getImage());
            }
            if (bookUpdateDTO.getAuthor() != null) {
                existingBook.setAuthor(bookUpdateDTO.getAuthor());
            }
            if (bookUpdateDTO.getGenre() != null) {
                existingBook.setGenre(bookUpdateDTO.getGenre());
            }
            if (bookUpdateDTO.getYear() != null) {
                existingBook.setYear(bookUpdateDTO.getYear());
            }
            if (bookUpdateDTO.getEdition() != null) {
                existingBook.setEdition(bookUpdateDTO.getEdition());
            }
            if (bookUpdateDTO.getDescription() != null) {
                existingBook.setDescription(bookUpdateDTO.getDescription());
            }
            if (bookUpdateDTO.getLanguage() != null) {
                existingBook.setLanguage(bookUpdateDTO.getLanguage());
            }
            if (bookUpdateDTO.getAvailability() != null) {
                existingBook.setAvailability(bookUpdateDTO.getAvailability());
            }
            if (bookUpdateDTO.getAvailableCopies() != null) {
                existingBook.setAvailableCopies(bookUpdateDTO.getAvailableCopies());
            }
            if (bookUpdateDTO.getLocation() != null) {
                existingBook.setLocation(bookUpdateDTO.getLocation());
            }

            existingBook.setUpdatedAt(LocalDateTime.now());

            Book updatedBook = bookRepository.save(existingBook);
            return Optional.of(convertToResponseDTO(updatedBook));
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

    // Get books by availability
    public List<BookResponseDTO> getBooksByAvailability(Boolean availability) {
        List<Book> books = bookRepository.findByAvailability(availability);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Search books by author
    public List<BookResponseDTO> searchBooksByAuthor(String author) {
        List<Book> books = bookRepository.findByAuthorContainingIgnoreCase(author);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Search books by title
    public List<BookResponseDTO> searchBooksByTitle(String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Search books by genre
    public List<BookResponseDTO> searchBooksByGenre(String genre) {
        List<Book> books = bookRepository.findByGenreContainingIgnoreCase(genre);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Search books by multiple criteria
    public List<BookResponseDTO> searchBooks(String searchTerm) {
        List<Book> books = bookRepository.searchBooks(searchTerm);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get books by language
    public List<BookResponseDTO> getBooksByLanguage(String language) {
        List<Book> books = bookRepository.findByLanguage(language);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get books by year
    public List<BookResponseDTO> getBooksByYear(Integer year) {
        List<Book> books = bookRepository.findByYear(year);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get books by location
    public List<BookResponseDTO> getBooksByLocation(String location) {
        List<Book> books = bookRepository.findByLocation(location);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get book statistics
    public BookStatsDTO getBookStatistics() {
        long totalBooks = bookRepository.count();
        long availableBooks = bookRepository.countByAvailabilityTrue();
        long unavailableBooks = bookRepository.countByAvailabilityFalse();

        Optional<Integer> totalCopiesOpt = bookRepository.getTotalCopies();
        Optional<Integer> availableCopiesOpt = bookRepository.getTotalAvailableCopies();

        int totalCopies = totalCopiesOpt.orElse(0);
        int availableCopies = availableCopiesOpt.orElse(0);

        return new BookStatsDTO(totalBooks, availableBooks, unavailableBooks,
                totalCopies, availableCopies);
    }

    // Get books with available copies
    public List<BookResponseDTO> getBooksWithAvailableCopies() {
        List<Book> books = bookRepository.findBooksWithAvailableCopies();
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get books by year range
    public List<BookResponseDTO> getBooksByYearRange(Integer startYear, Integer endYear) {
        List<Book> books = bookRepository.findByYearBetween(startYear, endYear);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get books with minimum copies
    public List<BookResponseDTO> getBooksWithMinimumCopies(Integer minCopies) {
        List<Book> books = bookRepository.findBooksWithMinimumCopies(minCopies);
        return books.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // Helper method to convert Book entity to BookResponseDTO
    private BookResponseDTO convertToResponseDTO(Book book) {
        return new BookResponseDTO(
                book.getId(),
                book.getBookNo(),
                book.getTitle(),
                book.getImage(),
                book.getAuthor(),
                book.getGenre(),
                book.getYear(),
                book.getEdition(),
                book.getDescription(),
                book.getLanguage(),
                book.getAvailability(),
                book.getAvailableCopies(),
                book.getLocation(),
                book.getCreatedAt(),
                book.getUpdatedAt()
        );
    }
}