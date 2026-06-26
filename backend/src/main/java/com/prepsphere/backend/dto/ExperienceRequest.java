package com.prepsphere.backend.dto;

import com.prepsphere.backend.model.Experience;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class ExperienceRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotNull(message = "Year is required")
    private Integer year;

    @NotBlank(message = "Branch is required")
    private String branch;

    @Positive(message = "CTC must be a positive value")
    private double ctc;

    private List<Experience.Round> rounds;
}
