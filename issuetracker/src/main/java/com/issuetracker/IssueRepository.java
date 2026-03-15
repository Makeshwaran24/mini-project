package com.issuetracker;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {

    List<Issue> findByStatus(Issue.Status status);
    List<Issue> findByPriority(Issue.Priority priority);
    List<Issue> findByStatusAndPriority(Issue.Status status, Issue.Priority priority);
}