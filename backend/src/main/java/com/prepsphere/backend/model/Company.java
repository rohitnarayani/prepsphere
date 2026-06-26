package com.prepsphere.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "companies") // Maps to the "companies" collection in MongoDB
public class Company {

    @Id
    private String id;

    @Indexed(unique = true)    // Ensures no duplicate company names
    private String name;       // e.g., "Amazon", "TCS"

    private int totalPosts;    // How many experience posts mention this company

    private double avgCTC;     // Average CTC across all posts for this company (in LPA)
}
