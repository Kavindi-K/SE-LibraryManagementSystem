package com.example.librarybackend.reservation;

import com.example.librarybackend.common.IdService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final ReservationRepository repository;
    private final IdService idService;

    public ReservationController(ReservationRepository repository, IdService idService) {
        this.repository = repository;
        this.idService = idService;
    }

    @GetMapping
    public List<Reservation> list() { return repository.findAll(); }

    @PostMapping
    public Reservation create(@Valid @RequestBody Reservation body) {
        body.setId(null);
        body.setReservationNumber(idService.nextReserveNumber());
        if (body.getStatus() == null) body.setStatus("PENDING");
        return repository.save(body);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reservation> update(@PathVariable String id, @Valid @RequestBody Reservation body) {
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
    public ResponseEntity<Reservation> markReceived(@PathVariable String id) {
        return repository.findById(id)
                .map(existing -> {
                    existing.setStatus("RECEIVED");
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!repository.existsById(id)) return ResponseEntity.notFound().build();
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}



