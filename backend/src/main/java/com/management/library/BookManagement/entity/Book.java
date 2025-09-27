package com.management.library.BookManagement.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Document(collection = "books")
public class Book {

    @Id
    private String id;

    @Field("title")
    private String title;

    @Field("image")
    private String image;

    @Field("author")
    private String author;

    @Field("genre")
    private String genre;

    @Field("year")
    private Integer year;

    @Field("edition")
    private String edition;

    @Field("description")
    private String description;

    @Field("language")
    private String language;

    @Field("availability")
    private Boolean availability;

    @Field("availablecopies")
    private Integer availableCopies;

    @Field("location")
    private String location;

    @Field("createdat")
    private LocalDateTime createdAt;

    @Field("updatedat")
    private LocalDateTime updatedAt;

    // Constructors
    public Book() {
    }

    public Book(String title, String image, String author, String genre, Integer year,
                String edition, String description, String language, Boolean availability,
                Integer availableCopies, String location) {
        this.title = title;
        this.image = image;
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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getAvailability() {
        return availability;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public Integer getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(Integer availableCopies) {
        this.availableCopies = availableCopies;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}