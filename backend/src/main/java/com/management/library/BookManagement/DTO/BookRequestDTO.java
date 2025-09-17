package com.management.library.BookManagement.DTO;

import com.management.library.BookManagement.model.Book;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor   // Required for Jackson/Spring deserialization
@AllArgsConstructor  // Constructor with all fields
public class BookRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotEmpty(message = "At least one author is required")
    private List<String> authors;

    private List<String> genres;

    @NotNull(message = "Publication year is required")
    @Min(value = 1000, message = "Year must be a valid year")
    private Integer year;

    private String edition;
    private String description;
    private String language;
    private Boolean availability = true;
    private String borrower;

    @Min(value = 0, message = "Available copies cannot be negative")
    private Integer availableCopies = 1;

    private String location;

    // Constructor with required fields
    public BookRequestDTO(String title, List<String> authors, Integer year) {
        this.title = title;
        this.authors = authors;
        this.year = year;
        this.availability = true;
        this.availableCopies = 1;
    }

    // Mapping method to convert DTO to Book entity
    public Book toEntity() {
        Book book = new Book();
        book.setTitle(this.title);
        book.setAuthors(this.authors);
        book.setGenres(this.genres);
        book.setYear(this.year);
        book.setEdition(this.edition);
        book.setDescription(this.description);
        book.setLanguage(this.language);
        book.setAvailability(this.availability);
        book.setBorrower(this.borrower);
        book.setAvailableCopies(this.availableCopies);
        book.setLocation(this.location);
        return book;
    }
}
