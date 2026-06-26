package com.prepsphere.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data                          // Lombok: auto-generates getters, setters, toString, equals, hashCode
@NoArgsConstructor             // Lombok: generates a no-argument constructor (required by MongoDB)
@AllArgsConstructor            // Lombok: generates a constructor with all fields
@Document(collection = "users") // MongoDB: maps this class to the "users" collection in MongoDB
public class User {

    @Id                        // MongoDB: marks this field as the document's primary key (_id in MongoDB)
    private String id;

    private String name;

    @Indexed(unique = true)    // MongoDB: creates a unique index on email so no two users share one
    private String email;

    private String password;   // Note: store a hashed password (e.g., BCrypt) — never plain text

    private String branch;     // e.g., "CSE", "ECE", "Mechanical"

    private int year;          // e.g., 1, 2, 3, 4
}
