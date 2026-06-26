package com.prepsphere.backend.controller;

import com.prepsphere.backend.dto.ExperienceRequest;
import com.prepsphere.backend.model.Experience;
import com.prepsphere.backend.service.ExperienceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "http://localhost:5173")
public class ExperienceController {

    @Autowired
    private ExperienceService experienceService;

    // ── POST /api/experiences (Create a post) ───────────────────────────────
    @PostMapping
    public ResponseEntity<?> createExperience(@Valid @RequestBody ExperienceRequest request) {
        try {
            Experience experience = experienceService.createExperience(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(experience);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to create experience: " + e.getMessage()));
        }
    }

    // ── GET /api/experiences (Get all, newest first) ─────────────────────────
    @GetMapping
    public ResponseEntity<List<Experience>> getAllExperiences() {
        List<Experience> experiences = experienceService.getAllExperiences();
        return ResponseEntity.ok(experiences);
    }

    // ── GET /api/experiences/company/{companyName} (Filter by company) ──────
    @GetMapping("/company/{companyName}")
    public ResponseEntity<List<Experience>> getExperiencesByCompany(@PathVariable String companyName) {
        List<Experience> experiences = experienceService.getExperiencesByCompany(companyName);
        return ResponseEntity.ok(experiences);
    }

    // ── GET /api/experiences/{id} (Get single experience details) ───────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getExperienceById(@PathVariable String id) {
        try {
            Experience experience = experienceService.getExperienceById(id);
            return ResponseEntity.ok(experience);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── POST /api/experiences/{id}/upvote (Toggle upvote) ───────────────────
    // Payload expects: { "userId": "some-user-id" }
    @PostMapping("/{id}/upvote")
    public ResponseEntity<?> upvoteExperience(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            String userId = payload.get("userId");
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "userId is required in the request body"));
            }

            Experience updated = experienceService.upvoteExperience(id, userId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ── POST /api/experiences/{id}/comment (Add a comment) ──────────────────
    // Payload expects: { "userId": "some-user-id", "text": "my comment" }
    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            String userId = payload.get("userId");
            String text = payload.get("text");

            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "userId is required"));
            }
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "text is required"));
            }

            Experience updated = experienceService.addComment(id, userId, text);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
