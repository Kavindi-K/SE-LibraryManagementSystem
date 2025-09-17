package com.management.library.BookManagement.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class BookResponseDTO {

    private String id;
    private String title;
    private List<String> authors;
    private List<String> genres;
    private Integer year;
    private String edition;
    private String description;
    private String language;
    private Boolean availability;
    private String borrower;
    private Integer availableCopies;
    private String location;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public BookResponseDTO() {}

    // Constructor with all fields
    public BookResponseDTO(String id, String title, List<String> authors, List<String> genres,
                           Integer year, String edition, String description, String language,
                           Boolean availability, String borrower, Integer availableCopies,
                           String location, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.authors = authors;
        this.genres = genres;
        this.year = year;
        this.edition = edition;
        this.description = description;
        this.language = language;
        this.availability = availability;
        this.borrower = borrower;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getAuthors() {
        return authors;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
    }

    public List<String> getGenres() {
        return genres;
    }

    public void setGenres(List<String> genres) {
        this.genres = genres;
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

    public String getBorrower() {
        return borrower;
    }

    public void setBorrower(String borrower) {
        this.borrower = borrower;
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