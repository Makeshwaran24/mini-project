package com.issuetracker.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/issues")
@CrossOrigin(origins = "http://localhost:3000")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @GetMapping
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueService.getAllIssues());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getIssueById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(issueService.getIssueById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createIssue(@RequestBody Issue issue) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(issueService.createIssue(issue));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Failed to create issue: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIssue(@PathVariable Long id, @RequestBody Issue issue) {
        try {
            return ResponseEntity.ok(issueService.updateIssue(id, issue));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String, String> body) {
        try {
            Issue.Status newStatus = Issue.Status.valueOf(body.get("status"));
            return ResponseEntity.ok(issueService.updateIssueStatus(id, newStatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid status. Use: OPEN, IN_PROGRESS, CLOSED"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIssue(@PathVariable Long id) {
        try {
            issueService.deleteIssue(id);
            return ResponseEntity.ok(Map.of("message", "Issue deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/filter/status/{status}")
    public ResponseEntity<?> getByStatus(@PathVariable String status) {
        try {
            Issue.Status s = Issue.Status.valueOf(status.toUpperCase());
            return ResponseEntity.ok(issueService.getIssuesByStatus(s));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid status. Use: OPEN, IN_PROGRESS, CLOSED"));
        }
    }

    @GetMapping("/stats/summary")
    public ResponseEntity<Map<String, Long>> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("total",      (long) issueService.getAllIssues().size());
        stats.put("open",       issueService.countByStatus(Issue.Status.OPEN));
        stats.put("inProgress", issueService.countByStatus(Issue.Status.IN_PROGRESS));
        stats.put("closed",     issueService.countByStatus(Issue.Status.CLOSED));
        return ResponseEntity.ok(stats);
    }
}
