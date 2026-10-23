package com.trash2tech;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class CollectionRequestController {
    private final CollectionRequestRepository repository;

    public CollectionRequestController(CollectionRequestRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<CollectionRequest> all() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollectionRequest create(@RequestBody CollectionRequest request) {
        if (request.getName() == null || request.getName().isBlank()
                || request.getItemType() == null || request.getItemType().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name and e-waste type are required");
        }
        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }
        request.setStatus("Pending");
        return repository.save(request);
    }

    @PutMapping("/{id}/status")
    public CollectionRequest updateStatus(@PathVariable Long id, @RequestBody StatusUpdate update) {
        CollectionRequest request = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found"));
        if (!"Pending".equals(update.status()) && !"Completed".equals(update.status())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be Pending or Completed");
        }
        request.setStatus(update.status());
        return repository.save(request);
    }

    public record StatusUpdate(String status) {}
}
