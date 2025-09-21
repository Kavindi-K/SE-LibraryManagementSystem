package com.management.library.BorrowingReservation.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class FeeService {
    public int calculateLateFee(LocalDate dueDate, LocalDate returnDateOrNull, int weeklyFee) {
        if (dueDate == null) return 0;
        LocalDate end = returnDateOrNull != null ? returnDateOrNull : LocalDate.now();
        if (!end.isAfter(dueDate)) return 0;
        long daysLate = ChronoUnit.DAYS.between(dueDate, end);
        long weeksLate = (long) Math.ceil(daysLate / 7.0);
        return (int) (weeksLate * weeklyFee);
    }
}



