package com.management.library.BookManagement.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Document(collection = "books")
public class Book {
    // Getters and Setters
    @Setter
    @Id
    private String id;
    private String title;
    // Fixed: Changed method name from getAuthor to getAuthors
    private List<String> authors;
    // Fixed: Changed method name from getGenre to getGenres
    private List<String> genres;
    private Integer year;
    private String edition;
    private String description;
    private String language;
    // Fixed: Changed method name from getAvailable to getAvailability
    private Boolean availability;
    private String borrower;
    // Fixed: Changed method name from getCopies to getAvailableCopies
    private Integer availableCopies;
    private String location;
    // Added missing getters/setters for timestamps
    @Setter
    private LocalDateTime createdAt;
    @Setter
    private LocalDateTime updatedAt;

    // Constructors
    public Book() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.availability = true;
        this.availableCopies = 1;
    }

    public void setTitle(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }

    // Fixed: Changed method name from setAuthor to setAuthors
    public void setAuthors(List<String> authors) {
        this.authors = authors;
        this.updatedAt = LocalDateTime.now();
    }

    // Fixed: Changed method name from setGenre to setGenres
    public void setGenres(List<String> genres) {
        this.genres = genres;
        this.updatedAt = LocalDateTime.now();
    }

    public void setYear(Integer year) {
        this.year = year;
        this.updatedAt = LocalDateTime.now();
    }

    public void setEdition(String edition) {
        this.edition = edition;
        this.updatedAt = LocalDateTime.now();
    }

    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public void setLanguage(String language) {
        this.language = language;
        this.updatedAt = LocalDateTime.now();
    }

    // Fixed: Changed method name from setAvailable to setAvailability
    public void setAvailability(Boolean availability) {
        this.availability = availability;
        this.updatedAt = LocalDateTime.now();
    }

    public void setBorrower(String borrower) {
        this.borrower = borrower;
        this.updatedAt = LocalDateTime.now();
    }

    // Fixed: Changed method name from setCopies to setAvailableCopies
    public void setAvailableCopies(Integer availableCopies) {
        this.availableCopies = availableCopies;
        this.updatedAt = LocalDateTime.now();
    }

    public void setLocation(String location) {
        this.location = location;
        this.updatedAt = LocalDateTime.now();
    }

}