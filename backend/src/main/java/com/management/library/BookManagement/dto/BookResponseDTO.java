package com.management.library.BookManagement.dto;

import java.time.LocalDateTime;

public class BookResponseDTO {

    private String id;
    private String bookNo;
    private String title;
    private String image;
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

    // Constructors
    public BookResponseDTO() {
    }

    public BookResponseDTO(String id, String bookNo, String title, String image, String author, String genre,
                           Integer year, String edition, String description, String language,
                           Boolean availability, Integer availableCopies, String location,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.bookNo = bookNo;
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
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookNo() {
        return bookNo;
    }

    public void setBookNo(String bookNo) {
        this.bookNo = bookNo;
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