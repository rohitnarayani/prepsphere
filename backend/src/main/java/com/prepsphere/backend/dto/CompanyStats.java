package com.prepsphere.backend.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;
import java.util.List;

@Data
public class CompanyStats {
    
    // In MongoDB aggregation grouping, the grouped key (companyName) becomes the "_id" field.
    // By using @Id, we tell Spring Data to map the "_id" from the aggregation result 
    // into this "companyName" field.
    @Id
    private String companyName;
    
    private long totalPosts;
    
    private double avgCTC;
    
    // List of distinct years this company was visited
    private List<Integer> years;
}
