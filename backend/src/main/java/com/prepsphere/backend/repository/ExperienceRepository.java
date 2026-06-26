package com.prepsphere.backend.repository;

import com.prepsphere.backend.model.Experience;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends MongoRepository<Experience, String> {

    // Fetch all experiences posted by a specific user
    // → db.experiences.find({ userId: <value> })
    List<Experience> findByUserId(String userId);

    // Fetch all experiences for a specific company (case-sensitive)
    // → db.experiences.find({ companyName: <value> })
    List<Experience> findByCompanyName(String companyName);

    // Fetch experiences filtered by both company and branch
    // → db.experiences.find({ companyName: <value>, branch: <value> })
    List<Experience> findByCompanyNameAndBranch(String companyName, String branch);

    // Fetch experiences for a company in a given year
    List<Experience> findByCompanyNameAndYear(String companyName, int year);

    // Fetch all experiences for a specific college (case-sensitive)
    List<Experience> findByCollegeName(String collegeName);
}
