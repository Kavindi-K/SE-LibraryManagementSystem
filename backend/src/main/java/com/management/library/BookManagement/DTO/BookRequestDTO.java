package com.management.library.BookManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequestDto {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    @NotBlank(message = "Genre is required")
    private String genre;

    @NotNull(message = "Year is required")
    @Min(value = 1000, message = "Year must be a valid year")
    private Integer year;

    private String edition;
    private String description;

    @NotBlank(message = "Language is required")
    private String language;

    @NotNull(message = "Availability status is required")
    private Boolean availability;

    @NotNull(message = "Available copies count is required")
    @Min(value = 0, message = "Available copies cannot be negative")
    private Integer availableCopies;

    @NotBlank(message = "Location is required")
    private String location;
}