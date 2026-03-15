import React, { useState } from "react";
import IssueCard from "./IssueCard";

function IssueList({ issues, onEdit, onDelete, onStatusChange, loading }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = issues.filter((issue) => {
    const matchesFilter = activeFilter === "ALL" || issue.status === activeFilter;
    const matchesSearch =
      searchQuery === "" ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (issue.description &&
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const tabs = [
    { key: "ALL",         label: "All Issues",  count: issues.length },
    { key: "OPEN",        label: "Open",        count: issues.filter(i => i.status === "OPEN").length },
    { key: "IN_PROGRESS", label: "In Progress", count: issues.filter(i => i.status === "IN_PROGRESS").length },
    { key: "CLOSED",      label: "Closed",      count: issues.filter(i => i.status === "CLOSED").length },
  ];

  const SkeletonCard = () => (
    <div className="issue-card skeleton">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text short"></div>
    </div>
  );

  return (
    <div className="issue-list-container">
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery("")}>✕</button>
        )}
      </div>
      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeFilter === tab.key ? "tab-btn--active" : ""}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>
      <div className="issues-grid">
        {loading ? (
          [1, 2, 3].map((n) => <SkeletonCard key={n} />)
        ) : filteredIssues.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No issues found</h3>
            <p>{searchQuery ? `No results for "${searchQuery}"` : "Create your first issue!"}</p>
          </div>
        ) : (
          filteredIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
      {!loading && filteredIssues.length > 0 && (
        <div className="result-count">
          Showing {filteredIssues.length} of {issues.length} issues
        </div>
      )}
    </div>
  );
}

export default IssueList;
