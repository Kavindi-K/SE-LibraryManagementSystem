package com.management.library.BookManagement.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookResponseDto {

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
}