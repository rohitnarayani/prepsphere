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
        // Build the aggregation pipeline:
        // 1. Group by companyName, count documents, and calculate average ctc
        // 2. Sort by totalPosts in descending order
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("companyName")
                        .count().as("totalPosts")
                        .avg("ctc").as("avgCTC"),
                Aggregation.sort(Sort.Direction.DESC, "totalPosts")
        );

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
        // Build the aggregation pipeline:
        // 1. Match only the experiences for the requested company (case-insensitive or exact)
        // 2. Group by companyName, count documents, calculate average ctc, and collect distinct years using addToSet
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("companyName").is(companyName)),
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
            throw new RuntimeException("Company stats not found for: " + companyName);
        }

        return mappedResults.get(0);
    }
}
