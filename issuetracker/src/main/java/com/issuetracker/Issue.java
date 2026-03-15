// ============================================
// File: backend/src/main/java/com/issuetracker/model/Issue.java
// This is the MODEL (also called Entity).
// It maps directly to a MySQL table called "issues".
// Each field below = one column in the database table.
// ============================================

package com.issuetracker;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Entity tells Spring: "This class is a database table"
@Entity
// @Table names the MySQL table "issues"
@Table(name = "issues")
// Lombok annotations — auto-generate getters, setters, constructors
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Issue {

    // @Id = this is the Primary Key
    // @GeneratedValue = MySQL auto-increments this (1, 2, 3, ...)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Issue title — cannot be empty (nullable = false)
    @Column(nullable = false)
    private String title;

    // Longer text description — stored as TEXT in MySQL
    @Column(columnDefinition = "TEXT")
    private String description;

    // Priority: LOW, MEDIUM, HIGH
    // @Enumerated stores the string name (not a number)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    // Status: OPEN, IN_PROGRESS, CLOSED
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    // Auto-set to current date/time when issue is created
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    // @PrePersist runs automatically BEFORE saving to DB
    // This ensures createdDate is always set
    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }

    // ---- Enums (defined inside the class for simplicity) ----

    // Priority levels available for an issue
    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    // Status options for an issue lifecycle
    public enum Status {
        OPEN, IN_PROGRESS, CLOSED
    }
}