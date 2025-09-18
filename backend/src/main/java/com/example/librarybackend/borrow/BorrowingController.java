package com.example.librarybackend.borrow;

import com.example.librarybackend.common.FeeService;
import com.example.librarybackend.common.IdService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {
    private final BorrowingRepository repository;
    private final IdService idService;
    private final FeeService feeService;

    public BorrowingController(BorrowingRepository repository, IdService idService, FeeService feeService) {
        this.repository = repository;
        this.idService = idService;
        this.feeService = feeService;
    }

    @GetMapping
    public List<Borrowing> list() {
        return repository.findAll();
    }

    @PostMapping
    public Borrowing create(@Valid @RequestBody Borrowing body) {
        body.setId(null);
        body.setBorrowingNumber(idService.nextBorrowNumber());
        body.setStatus(body.getReturnDate() == null ? "ACTIVE" : "RETURNED");
        body.setLateFee(feeService.calculateLateFee(body.getDueDate(), body.getReturnDate(), 100));
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Borrowing> update(@PathVariable("id") String id, @Valid @RequestBody Borrowing body) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setMemberId(body.getMemberId());
                    existing.setBookId(body.getBookId());
                    existing.setBorrowDate(body.getBorrowDate());
                    existing.setDueDate(body.getDueDate());
                    existing.setReturnDate(body.getReturnDate());
                    existing.setStatus(body.getReturnDate() == null ? "ACTIVE" : "RETURNED");
                    existing.setLateFee(feeService.calculateLateFee(existing.getDueDate(), existing.getReturnDate(), 100));
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<Borrowing> markReturned(@PathVariable("id") String id) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setStatus("RETURNED");
                    existing.setReturnDate(java.time.LocalDate.now());
                    existing.setLateFee(feeService.calculateLateFee(existing.getDueDate(), existing.getReturnDate(), 100));
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}



