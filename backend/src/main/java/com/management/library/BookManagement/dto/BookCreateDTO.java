package com.management.library.BookManagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class BookCreateDTO {

    @NotBlank(message = "Title is required")
    private String title;

    private String image;

    @NotBlank(message = "Author is required")
    private String author;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotNull(message = "Year is required")
    private Integer year;

    private String edition;

    private String description;

    @NotBlank(message = "Language is required")
    private String language;

    @NotNull(message = "Availability is required")
    private Boolean availability;

    @NotNull(message = "Available copies is required")
    @Min(value = 0, message = "Available copies must be non-negative")
    private Integer availableCopies;

    @NotBlank(message = "Location is required")
    private String location;

    // Constructors
    public BookCreateDTO() {
    }

    public BookCreateDTO(String title, String image, String author, String genre,
                         Integer year, String edition, String description, String language,
                         Boolean availability, Integer availableCopies, String location) {
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
    }

    // Getters and Setters
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
}