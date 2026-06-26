package com.prepsphere.backend.service;

import com.prepsphere.backend.dto.LoginRequest;
import com.prepsphere.backend.dto.SignupRequest;
import com.prepsphere.backend.model.User;
import com.prepsphere.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// ─── How BCrypt works (simple explanation) ────────────────────────────────────
//
//  BCrypt is a one-way hashing algorithm. When you hash "myPassword123":
//    → "$2a$10$KcFzKlmb2Q8eE6vXAkT..." (a 60-char string)
//
//  "One-way" means you CANNOT reverse it to get "myPassword123" back.
//  So even if your database is stolen, attackers only see gibberish.
//
//  At login, instead of decrypting, BCrypt re-hashes the attempt and
//  compares — if the hashes match, the password was correct.
//
//  The "$10$" part is the "cost factor" — it controls how slow the hash is.
//  Slow is GOOD for passwords: it makes brute-force attacks impractical.
// ─────────────────────────────────────────────────────────────────────────────

@Service  // Tells Spring this is a service bean — it holds business logic, not HTTP or DB details
public class AuthService {

    // @Autowired tells Spring to automatically inject an instance of UserRepository here.
    // You don't call "new UserRepository()" yourself — Spring manages it.
    @Autowired
    private UserRepository userRepository;

    // BCryptPasswordEncoder is the class from spring-security-crypto that handles hashing.
    // Strength 12 means it runs 2^12 = 4096 iterations — strong enough, not too slow.
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    // ── SIGNUP ────────────────────────────────────────────────────────────────
    public User signup(SignupRequest request) {

        // Step 1: Check if the email is already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            // RuntimeException bubbles up to the controller, which catches it
            throw new RuntimeException("An account with this email already exists.");
        }

        // Step 2: Build a new User object from the DTO fields
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setBranch(request.getBranch());
        user.setYear(request.getYear());

        // Step 3: Hash the password — NEVER store it in plain text
        // encode() internally generates a random salt and combines it into the hash string
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Step 4: Save to MongoDB and return the saved document (now with an auto-assigned id)
        return userRepository.save(user);
    }

    // ── LOGIN ─────────────────────────────────────────────────────────────────
    public User login(LoginRequest request) {

        // Step 1: Try to find the user by email
        // We use a single generic error message for BOTH "email not found" AND "wrong password".
        //
        // ─── Why? (Security reason) ───────────────────────────────────────────
        //   If you return "Email not found", attackers can enumerate which emails
        //   are registered in your system (a "user enumeration" attack).
        //   With a generic message like "Invalid credentials", they learn nothing.
        //   This is standard practice in any production auth system.
        // ─────────────────────────────────────────────────────────────────────
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        // Step 2: Compare the plain-text attempt against the stored BCrypt hash.
        // matches(rawPassword, hashedPassword) → true if they correspond, false otherwise
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password.");
        }

        // Step 3: Return the authenticated user (controller will decide what to send back)
        return user;
    }
}
