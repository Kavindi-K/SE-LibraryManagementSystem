package com.management.library.BorrowingReservation.controller;

import com.management.library.BorrowingReservation.entity.Borrowing;
import com.management.library.BorrowingReservation.entity.Reservation;
import com.management.library.BorrowingReservation.repository.BorrowingRepository;
import com.management.library.BorrowingReservation.repository.ReservationRepository;
import com.management.library.BorrowingReservation.service.IdService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationRepository repository;
    private final IdService idService;
    private final BorrowingRepository borrowingRepository;

    public ReservationController(ReservationRepository repository, IdService idService, BorrowingRepository borrowingRepository) {
        this.repository = repository;
        this.idService = idService;
        this.borrowingRepository = borrowingRepository;
    }

    @GetMapping
    public List<Reservation> list(@RequestParam(value = "memberId", required = false) String memberId) {
        if (memberId != null && !memberId.isBlank()) {
            return repository.findByMemberId(memberId);
        }
        return repository.findAll();
    }

    @PostMapping
    public Reservation create(@Valid @RequestBody Reservation body) {
        body.setId(null);
        body.setReservationNumber(idService.nextReserveNumber());
        if (body.getStatus() == null) body.setStatus("PENDING");
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> update(@PathVariable("id") String id, @Valid @RequestBody Reservation body) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setMemberId(body.getMemberId());
                    existing.setBookId(body.getBookId());
                    existing.setReservationDate(body.getReservationDate());
                    existing.setStatus(body.getStatus());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/receive")
    public ResponseEntity<?> markReceived(@PathVariable("id") String id) {
        return (ResponseEntity<Reservation>) repository.findById(id)
                .map(existing -> {
                    // Allow only if currently PENDING
                    if (existing.getStatus() != null && !existing.getStatus().equals("PENDING")) {
                        return ResponseEntity.badRequest().body(null);
                    }

                    // Prevent duplicate ACTIVE borrowing for same member-book
                    if (borrowingRepository.existsByMemberIdAndBookIdAndStatus(existing.getMemberId(), existing.getBookId(), "ACTIVE")) {
                        // Still mark reservation as RECEIVED to close it, but do not create another borrowing
                        existing.setStatus("RECEIVED");
                        Reservation updated = repository.save(existing);
                        return ResponseEntity.ok(updated);
                    }

                    existing.setStatus("RECEIVED");
                    Reservation saved = repository.save(existing);

                    // When a reservation is received, create a borrowing entry automatically
                    Borrowing borrowing = new Borrowing();
                    borrowing.setId(null);
                    borrowing.setBorrowingNumber(idService.nextBorrowNumber());
                    borrowing.setMemberId(saved.getMemberId());
                    borrowing.setBookId(saved.getBookId());
                    LocalDate borrowDate = LocalDate.now();
                    borrowing.setBorrowDate(borrowDate);
                    borrowing.setDueDate(borrowDate.plusDays(14));
                    borrowing.setReturnDate(null);
                    borrowing.setStatus("ACTIVE");
                    borrowing.setLateFee(0);
                    borrowingRepository.save(borrowing);

                    // Auto-cancel other PENDING reservations for the same member and book
                    var others = repository.findByMemberIdAndBookIdAndStatus(saved.getMemberId(), saved.getBookId(), "PENDING");
                    for (Reservation r : others) {
                        if (!r.getId().equals(saved.getId())) {
                            r.setStatus("CANCELLED");
                            repository.save(r);
                        }
                    }

                    return ResponseEntity.ok(saved);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}



