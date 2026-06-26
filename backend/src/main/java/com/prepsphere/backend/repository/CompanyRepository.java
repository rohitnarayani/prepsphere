package com.prepsphere.backend.repository;

import com.prepsphere.backend.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {

    // Look up a company by its name
    // → db.companies.findOne({ name: <value> })
    Optional<Company> findByName(String name);

    // Check if a company already exists before inserting
    boolean existsByName(String name);
}
