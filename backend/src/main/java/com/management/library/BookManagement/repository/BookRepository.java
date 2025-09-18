package com.management.library.BookManagement.repository;

import com.management.library.BookManagement.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    // Find books by title (case insensitive)
    List<Book> findByTitleContainingIgnoreCase(String title);

    // Find books by author (case insensitive)
    List<Book> findByAuthorContainingIgnoreCase(String author);

    // Find books by genre
    List<Book> findByGenreIgnoreCase(String genre);

    // Find available books
    List<Book> findByAvailabilityTrue();

    // Find books by year
    List<Book> findByYear(Integer year);

    // Find books by language
    List<Book> findByLanguageIgnoreCase(String language);

    // Custom query to find books by multiple criteria
    @Query("{ $and: [ " +
            "{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'title': { $exists: false } } ] }, " +
            "{ $or: [ { 'author': { $regex: ?1, $options: 'i' } }, { 'author': { $exists: false } } ] }, " +
            "{ $or: [ { 'genre': { $regex: ?2, $options: 'i' } }, { 'genre': { $exists: false } } ] } " +
            "] }")
    List<Book> findBooksByCriteria(String title, String author, String genre);
}