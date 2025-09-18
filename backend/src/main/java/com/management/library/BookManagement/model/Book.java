package com.management.library.BookManagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    private String id;

    private String title;
    private String author;
    private String genre;
    private Integer year;
    private String edition;
    private String description;
    private String language;
    private Boolean availability;
    private Integer availableCopies;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Book(String title, String author, String genre, Integer year,
                String edition, String description, String language,
                Boolean availability, Integer availableCopies, String location) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.year = year;
        this.edition = edition;
        this.description = description;
        this.language = language;
        this.availability = availability;
        this.availableCopies = availableCopies;
        this.location = location;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}