package com.prepsphere.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "experiences") // Maps to the "experiences" collection in MongoDB
public class Experience {

    @Id
    private String id;

    private String userId;         // References the User who posted this experience

    private String companyName;    // e.g., "Google", "Infosys"

    private int year;              // Year the interview/placement happened

    private String branch;         // Branch of the student

    private double ctc;            // Cost to Company offered (in LPA)

    private String collegeName;    // College campus where the company visited

    // Embedded list — each round is stored as a nested object inside the same MongoDB document
    private List<Round> rounds;

    // List of userIds who upvoted this experience
    private List<String> upvotes;

    // Embedded list of comments, each stored as a nested object
    private List<Comment> comments;


    // ─── Inner class: Round ──────────────────────────────────────────────────
    // No @Document here — Round is NOT a separate MongoDB collection.
    // It is embedded (nested) directly inside each Experience document.
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Round {
        private String roundType;     // e.g., "Coding", "HR", "Technical", "Group Discussion"
        private String questions;     // Questions asked in this round
        private String notes;         // Any tips or observations
    }


    // ─── Inner class: Comment ─────────────────────────────────────────────────
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comment {
        private String userId;   // Who posted the comment
        private String text;     // Comment content
        private Date date;       // When the comment was posted
    }
}
