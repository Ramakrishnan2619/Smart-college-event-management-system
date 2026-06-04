package com.scems.controller;

import com.scems.model.User;
import com.scems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> data) {
        String role = data.getOrDefault("role", "student");
        User user = new User();
        user.setRole(role);
        user.setId((role.equals("admin") ? "A" : "S") + System.currentTimeMillis());
        user.setName(data.get("name"));

        if ("admin".equals(role)) {
            if (userRepository.findByUsername(data.get("username")) != null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }
            user.setUsername(data.get("username"));
            user.setPassword(data.get("password"));
        } else {
            if (userRepository.findByRollNo(data.get("rollNo")) != null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Roll number already exists"));
            }
            user.setRollNo(data.get("rollNo"));
            user.setPassword(data.get("password"));
            user.setDepartment(data.get("department"));
            user.setYear(Integer.parseInt(data.getOrDefault("year", "1")));
        }
        
        user.setEmail(data.get("email"));
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", user);
        response.put("token", "jwt-token-" + user.getId() + "-" + role + "-" + System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String role = credentials.get("role");
        String password = credentials.get("password");

        User user = null;
        if ("admin".equals(role)) {
            String username = credentials.get("username");
            user = userRepository.findByUsername(username);
        } else {
            String rollNo = credentials.get("rollNo");
            if (rollNo == null) rollNo = credentials.get("username"); // fallback
            user = userRepository.findByRollNo(rollNo);
        }

        if (user != null && user.getPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("token", "jwt-token-" + user.getId() + "-" + role + "-" + System.currentTimeMillis());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        try {
            String token = authHeader.substring(7);
            String[] parts = token.split("-");
            if (parts.length < 3) return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            
            String userId = parts[2];
            java.util.Optional<User> userOpt = userRepository.findByStringId(userId);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(userOpt.get());
            } else {
                return ResponseEntity.status(401).body(Map.of("error", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Authentication failed"));
        }
    }
}
