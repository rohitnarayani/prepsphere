package com.prepsphere.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Data;

// A DTO (Data Transfer Object) is a simple container for data coming IN from the client.
// We use a separate DTO instead of the User model directly because:
//   1. The client shouldn't set fields like id, upvotes, etc.
//   2. It keeps our API contract separate from our database structure.

@Data  // Lombok: generates getters, setters, toString, equals, hashCode
public class SignupRequest {

    @NotBlank(message = "Name is required")   // @NotBlank: fails if the field is null or empty/whitespace
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid format")  // @Email: validates format like user@domain.com
    private String email;

    @NotBlank(message = "Password is required")
    private String password;  // Will be hashed in the service — never stored as-is

    @NotBlank(message = "Branch is required")
    private String branch;

    @Min(value = 1, message = "Year must be at least 1")
    @Max(value = 4, message = "Year must be at most 4")
    private int year;
}
