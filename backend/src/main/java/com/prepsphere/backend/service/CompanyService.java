package com.prepsphere.backend.service;

import com.prepsphere.backend.dto.CompanyStats;
import com.prepsphere.backend.model.Experience;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompanyService {

    @Autowired
    private MongoTemplate mongoTemplate;

    // ── GET ALL COMPANIES (Sorted by totalPosts Descending) ──────────────────
    public List<CompanyStats> getAllCompanies() {
        return getAllCompanies(null);
    }

    public List<CompanyStats> getAllCompanies(String collegeName) {
        // Build the aggregation pipeline:
        // 1. Match only by collegeName if provided
        // 2. Group by companyName, count documents, and calculate average ctc
        // 3. Sort by totalPosts in descending order
        
        Aggregation aggregation;
        if (collegeName != null && !collegeName.trim().isEmpty()) {
            aggregation = Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("collegeName").is(collegeName)),
                    Aggregation.group("companyName")
                            .count().as("totalPosts")
                            .avg("ctc").as("avgCTC"),
                    Aggregation.sort(Sort.Direction.DESC, "totalPosts")
            );
        } else {
            aggregation = Aggregation.newAggregation(
                    Aggregation.group("companyName")
                            .count().as("totalPosts")
                            .avg("ctc").as("avgCTC"),
                    Aggregation.sort(Sort.Direction.DESC, "totalPosts")
            );
        }

        // Execute aggregation on the "experiences" collection and map output to CompanyStats DTO
        AggregationResults<CompanyStats> results = mongoTemplate.aggregate(
                aggregation, 
                Experience.class, 
                CompanyStats.class
        );

        return results.getMappedResults();
    }

    // ── GET COMPANY BY NAME (With distinct visit years list) ─────────────────
    public CompanyStats getCompanyByName(String companyName) {
        return getCompanyByName(companyName, null);
    }

    public CompanyStats getCompanyByName(String companyName, String collegeName) {
        // Build the aggregation pipeline:
        // 1. Match only the experiences for the requested company (and optionally collegeName)
        // 2. Group by companyName, count documents, calculate average ctc, and collect distinct years using addToSet
        
        Criteria criteria = Criteria.where("companyName").is(companyName);
        if (collegeName != null && !collegeName.trim().isEmpty()) {
            criteria.and("collegeName").is(collegeName);
        }

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(criteria),
                Aggregation.group("companyName")
                        .count().as("totalPosts")
                        .avg("ctc").as("avgCTC")
                        .addToSet("year").as("years")
        );

        AggregationResults<CompanyStats> results = mongoTemplate.aggregate(
                aggregation, 
                Experience.class, 
                CompanyStats.class
        );

        List<CompanyStats> mappedResults = results.getMappedResults();

        if (mappedResults.isEmpty()) {
            throw new RuntimeException("Company stats not found for: " + companyName + (collegeName != null ? " at college: " + collegeName : ""));
        }

        return mappedResults.get(0);
    }
}
