package com.prepsphere.backend.controller;

import com.prepsphere.backend.dto.LoginRequest;
import com.prepsphere.backend.dto.SignupRequest;
import com.prepsphere.backend.model.User;
import com.prepsphere.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

// @RestController = @Controller + @ResponseBody
//   → Every method in this class automatically converts its return value to JSON.
// @RequestMapping sets the base URL path for all endpoints in this controller.
@RestController
@RequestMapping("/api/auth")

// @CrossOrigin allows the React frontend (running on a different port like 5173)
// to call this backend. Without it, browsers block cross-origin requests (CORS policy).
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ── POST /api/auth/signup ─────────────────────────────────────────────────
    // @RequestBody reads the JSON body sent by the client and maps it to SignupRequest.
    // @Valid triggers the validation annotations (@NotBlank, @Email, etc.) on the DTO.
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            User savedUser = authService.signup(request);

            // Don't send the hashed password back to the client
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Account created successfully!");
            response.put("userId", savedUser.getId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());

            // HTTP 201 Created — the standard code when a new resource is successfully created
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (RuntimeException e) {
            // Email already exists → 400 Bad Request
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    // ── POST /api/auth/login ──────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);

            // Return only the safe, non-sensitive fields
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("userId", user.getId());
            response.put("name", user.getName());
            response.put("email", user.getEmail());
            response.put("branch", user.getBranch());
            response.put("year", user.getYear());

            // HTTP 200 OK
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Wrong email or password → 401 Unauthorized
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    // ── Validation error handler ──────────────────────────────────────────────
    // When @Valid fails (e.g., blank email), Spring throws MethodArgumentNotValidException.
    // This handler catches it and returns a clean 400 with all field errors listed.
    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(
            org.springframework.web.bind.MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
