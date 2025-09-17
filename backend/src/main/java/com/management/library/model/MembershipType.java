package com.management.library.model;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum MembershipType {
    STUDENT("Student", 1, 5, 0.50), // 1 year duration, 5 books limit, $0.50 daily fine
    FACULTY("Faculty", 2, 10, 0.25), // 2 years duration, 10 books limit, $0.25 daily fine
    REGULAR("Regular", 1, 3, 1.00),  // 1 year duration, 3 books limit, $1.00 daily fine
    PREMIUM("Premium", 2, 15, 0.10); // 2 years duration, 15 books limit, $0.10 daily fine

    private final String displayName;
    private final int durationYears;
    private final int borrowingLimit;
    private final double dailyFineRate;

    MembershipType(String displayName, int durationYears, int borrowingLimit, double dailyFineRate) {
        this.displayName = displayName;
        this.durationYears = durationYears;
        this.borrowingLimit = borrowingLimit;
        this.dailyFineRate = dailyFineRate;
    }

    // Add getName() method for frontend compatibility
    public String getName() {
        return this.name();
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getDurationYears() {
        return durationYears;
    }

    public int getBorrowingLimit() {
        return borrowingLimit;
    }

    public double getDailyFineRate() {
        return dailyFineRate;
    }
}
