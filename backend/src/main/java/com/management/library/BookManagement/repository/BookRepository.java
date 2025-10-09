package com.management.library.BookManagement.repository;

import com.management.library.BookManagement.entity.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    // Find books by book number
    Optional<Book> findByBookNo(String bookNo);

    // Check if book number exists
    boolean existsByBookNo(String bookNo);

    // Find books by availability status
    List<Book> findByAvailability(Boolean availability);

    // Find books by author
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // Find books by title
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Find books by genre
    List<Book> findByGenreContainingIgnoreCase(String genre);

    // Find books by language
    List<Book> findByLanguage(String language);

    // Find books by year
    List<Book> findByYear(Integer year);

    // Find books by location
    List<Book> findByLocation(String location);

    // Count total books
    long count();

    // Count available books
    long countByAvailabilityTrue();

    // Count unavailable books
    long countByAvailabilityFalse();

    // Custom query to find books with available copies > 0
    @Query("{ 'availableCopies': { $gt: 0 } }")
    List<Book> findBooksWithAvailableCopies();

    // Custom query to get sum of all available copies
    @Aggregation(pipeline = {
            "{ $group: { _id: null, totalAvailableCopies: { $sum: '$availableCopies' } } }"
    })
    Optional<Integer> getTotalAvailableCopies();

    // Custom query to get sum of all copies (assuming each book has a total copies field or using available copies as proxy)
    @Aggregation(pipeline = {
            "{ $group: { _id: null, totalCopies: { $sum: '$availableCopies' } } }"
    })
    Optional<Integer> getTotalCopies();

    // Search books by multiple criteria
    @Query("{ $or: [ " +
            "{ 'title': { $regex: ?0, $options: 'i' } }, " +
            "{ 'author': { $regex: ?0, $options: 'i' } }, " +
            "{ 'genre': { $regex: ?0, $options: 'i' } } " +
            "] }")
    List<Book> searchBooks(String searchTerm);

    // Find books by year range
    List<Book> findByYearBetween(Integer startYear, Integer endYear);

    // Find books with copies greater than specified number
    @Query("{ 'availableCopies': { $gte: ?0 } }")
    List<Book> findBooksWithMinimumCopies(Integer minCopies);
}