// ============================================
// File: backend/src/main/java/com/issuetracker/IssueTrackerApplication.java
// This is the ENTRY POINT of your Spring Boot app.
// Think of it as the "main switch" that turns everything on.
// ============================================

package com.issuetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// @SpringBootApplication enables:
// - Auto-configuration (Spring sets itself up automatically)
// - Component scanning (Spring finds all your classes)
// - Configuration support
@SpringBootApplication
public class IssuetrackerApplication {

    public static void main(String[] args) {
        // This line STARTS the Spring Boot server on port 8080
        SpringApplication.run(IssuetrackerApplication.class, args);
        System.out.println("✅ Issue Tracker Backend is running on http://localhost:8080");
    }
}