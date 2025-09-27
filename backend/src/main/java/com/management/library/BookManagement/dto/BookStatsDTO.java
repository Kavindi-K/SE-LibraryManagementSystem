package com.management.library.BookManagement.dto;

public class BookStatsDTO {

    private long totalBooks;
    private long availableBooks;
    private long unavailableBooks;
    private int totalCopies;
    private int availableCopies;

    // Constructors
    public BookStatsDTO() {
    }

    public BookStatsDTO(long totalBooks, long availableBooks, long unavailableBooks,
                        int totalCopies, int availableCopies) {
        this.totalBooks = totalBooks;
        this.availableBooks = availableBooks;
        this.unavailableBooks = unavailableBooks;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
    }

    // Getters and Setters
    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getAvailableBooks() {
        return availableBooks;
    }

    public void setAvailableBooks(long availableBooks) {
        this.availableBooks = availableBooks;
    }

    public long getUnavailableBooks() {
        return unavailableBooks;
    }

    public void setUnavailableBooks(long unavailableBooks) {
        this.unavailableBooks = unavailableBooks;
    }

    public int getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(int totalCopies) {
        this.totalCopies = totalCopies;
    }

    public int getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(int availableCopies) {
        this.availableCopies = availableCopies;
    }
}