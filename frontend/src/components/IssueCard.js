import React, { useState } from "react";

function IssueCard({ issue, onEdit, onDelete, onStatusChange }) {
  const [deleting, setDeleting] = useState(false);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "HIGH":   return "badge badge-high";
      case "MEDIUM": return "badge badge-medium";
      case "LOW":    return "badge badge-low";
      default:       return "badge";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "OPEN":        return "badge badge-open";
      case "IN_PROGRESS": return "badge badge-progress";
      case "CLOSED":      return "badge badge-closed";
      default:            return "badge";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete issue: "${issue.title}"?`)) {
      setDeleting(true);
      try {
        await onDelete(issue.id);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className={`issue-card ${issue.status === "CLOSED" ? "issue-card--closed" : ""}`}>
      <div className="card-header">
        <span className="issue-id">#{issue.id}</span>
        <div className="badges">
          <span className={getPriorityClass(issue.priority)}>
            {issue.priority === "HIGH" ? "🔴" : issue.priority === "MEDIUM" ? "🟡" : "🟢"}{" "}
            {issue.priority}
          </span>
          <span className={getStatusClass(issue.status)}>
            {issue.status === "OPEN" ? "🔵" : issue.status === "IN_PROGRESS" ? "🟠" : "✅"}{" "}
            {issue.status.replace("_", " ")}
          </span>
        </div>
      </div>
      <h3 className="card-title">{issue.title}</h3>
      {issue.description && (
        <p className="card-description">{issue.description}</p>
      )}
      <div className="card-footer">
        <span className="card-date">📅 {formatDate(issue.createdDate)}</span>
        <div className="card-actions">
          <select
            className="status-select"
            value={issue.status}
            onChange={(e) => onStatusChange(issue.id, e.target.value)}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button className="btn btn-edit" onClick={() => onEdit(issue)}>
            ✏️ Edit
          </button>
          <button className="btn btn-delete" onClick={handleDelete} disabled={deleting}>
            {deleting ? "..." : "🗑️"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueCard;