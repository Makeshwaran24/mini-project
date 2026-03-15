package com.issuetracker;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Issue getIssueById(Long id) {
        return issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found with id: " + id));
    }

    public Issue createIssue(Issue issue) {
        if (issue.getStatus() == null) {
            issue.setStatus(Issue.Status.OPEN);
        }
        if (issue.getPriority() == null) {
            issue.setPriority(Issue.Priority.MEDIUM);
        }
        return issueRepository.save(issue);
    }

    public Issue updateIssue(Long id, Issue updatedIssue) {
        Issue existingIssue = getIssueById(id);
        existingIssue.setTitle(updatedIssue.getTitle());
        existingIssue.setDescription(updatedIssue.getDescription());
        existingIssue.setPriority(updatedIssue.getPriority());
        existingIssue.setStatus(updatedIssue.getStatus());
        return issueRepository.save(existingIssue);
    }

    public Issue updateIssueStatus(Long id, Issue.Status newStatus) {
        Issue issue = getIssueById(id);
        issue.setStatus(newStatus);
        return issueRepository.save(issue);
    }

    public void deleteIssue(Long id) {
        if (!issueRepository.existsById(id)) {
            throw new RuntimeException("Issue not found with id: " + id);
        }
        issueRepository.deleteById(id);
    }

    public List<Issue> getIssuesByStatus(Issue.Status status) {
        return issueRepository.findByStatus(status);
    }

    public List<Issue> getIssuesByPriority(Issue.Priority priority) {
        return issueRepository.findByPriority(priority);
    }

    public long countByStatus(Issue.Status status) {
        return issueRepository.findByStatus(status).size();
    }
}