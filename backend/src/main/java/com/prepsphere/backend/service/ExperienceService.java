package com.prepsphere.backend.service;

import com.prepsphere.backend.dto.ExperienceRequest;
import com.prepsphere.backend.model.Experience;
import com.prepsphere.backend.model.Experience.Comment;
import com.prepsphere.backend.repository.ExperienceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ExperienceService {

    @Autowired
    private ExperienceRepository experienceRepository;

    // ── CREATE EXPERIENCE ─────────────────────────────────────────────────────
    public Experience createExperience(ExperienceRequest request) {
        Experience experience = new Experience();
        experience.setUserId(request.getUserId());
        experience.setCompanyName(request.getCompanyName());
        experience.setYear(request.getYear());
        experience.setBranch(request.getBranch());
        experience.setCtc(request.getCtc());
        experience.setCollegeName(request.getCollegeName());
        
        // If rounds are provided, copy them; otherwise initialize empty list
        if (request.getRounds() != null) {
            experience.setRounds(request.getRounds());
        } else {
            experience.setRounds(new ArrayList<>());
        }
        
        // Initialize upvotes and comments to empty lists so we don't get NullPointerExceptions later
        experience.setUpvotes(new ArrayList<>());
        experience.setComments(new ArrayList<>());

        return experienceRepository.save(experience);
    }

    // ── GET ALL EXPERIENCES (Newest First) ───────────────────────────────────
    public List<Experience> getAllExperiences() {
        // In MongoDB, the "_id" contains an embedded timestamp. Sorting by "id" in 
        // descending order naturally gives us the newest posts first.
        return experienceRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    // ── GET EXPERIENCES BY COMPANY ───────────────────────────────────────────
    public List<Experience> getExperiencesByCompany(String companyName) {
        return experienceRepository.findByCompanyName(companyName);
    }

    // ── GET EXPERIENCE BY ID ─────────────────────────────────────────────────
    public Experience getExperienceById(String id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
    }

    // ── UPVOTE EXPERIENCE (TOGGLE LOGIC) ─────────────────────────────────────
    public Experience upvoteExperience(String experienceId, String userId) {
        Experience experience = getExperienceById(experienceId);
        List<String> upvotes = experience.getUpvotes();
        
        if (upvotes == null) {
            upvotes = new ArrayList<>();
        }

        // Toggle logic: If user already upvoted, remove their vote. Otherwise, add it.
        if (upvotes.contains(userId)) {
            upvotes.remove(userId);
        } else {
            upvotes.add(userId);
        }

        experience.setUpvotes(upvotes);
        return experienceRepository.save(experience);
    }

    // ── ADD COMMENT ──────────────────────────────────────────────────────────
    public Experience addComment(String experienceId, String userId, String text) {
        Experience experience = getExperienceById(experienceId);
        List<Comment> comments = experience.getComments();
        
        if (comments == null) {
            comments = new ArrayList<>();
        }

        // Build the nested Comment object
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setText(text);
        comment.setDate(new Date()); // Current timestamp

        comments.add(comment);
        experience.setComments(comments);
        return experienceRepository.save(experience);
    }

    // ── GET EXPERIENCES BY COLLEGE ───────────────────────────────────────────
    public List<Experience> getExperiencesByCollege(String collegeName) {
        return experienceRepository.findByCollegeName(collegeName);
    }
}
