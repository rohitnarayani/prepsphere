package com.prepsphere.backend.controller;

import com.prepsphere.backend.dto.CompanyStats;
import com.prepsphere.backend.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    // ── GET /api/companies ───────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<CompanyStats>> getAllCompanies(@RequestParam(required = false) String collegeName) {
        List<CompanyStats> statsList = companyService.getAllCompanies(collegeName);
        return ResponseEntity.ok(statsList);
    }

    // ── GET /api/companies/{name} ────────────────────────────────────────────
    @GetMapping("/{name}")
    public ResponseEntity<?> getCompanyByName(@PathVariable String name, @RequestParam(required = false) String collegeName) {
        try {
            CompanyStats stats = companyService.getCompanyByName(name, collegeName);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
