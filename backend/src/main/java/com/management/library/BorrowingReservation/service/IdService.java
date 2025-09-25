package com.management.library.BorrowingReservation.service;

import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class IdService {
    private final AtomicInteger borrowSeq = new AtomicInteger(0);
    private final AtomicInteger reserveSeq = new AtomicInteger(0);

    public String nextBorrowNumber() {
        int seq = borrowSeq.incrementAndGet();
        return "BR" + Year.now().getValue() + String.format("%04d", seq);
    }

    public String nextReserveNumber() {
        int seq = reserveSeq.incrementAndGet();
        return "RS" + Year.now().getValue() + String.format("%04d", seq);
    }
}



