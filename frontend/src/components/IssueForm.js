import React, { useState, useEffect } from "react";

function IssueForm({ onSubmit, editingIssue, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    status: "OPEN",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingIssue) {
      setFormData({
        title: editingIssue.title || "",
        description: editingIssue.description || "",
        priority: editingIssue.priority || "MEDIUM",
        status: editingIssue.status || "OPEN",
      });
    } else {
      setFormData({ title: "", description: "", priority: "MEDIUM", status: "OPEN" });
    }
  }, [editingIssue]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(formData);
      if (!editingIssue) {
        setFormData({ title: "", description: "", priority: "MEDIUM", status: "OPEN" });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">
        {editingIssue ? "✏️ Edit Issue" : "➕ Create New Issue"}
      </h2>
      {error && <div className="error-banner">{error}</div>}
      <form onSubmit={handleSubmit} className="issue-form">
        <div className="form-group">
          <label htmlFor="title">Issue Title *</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Login button not working on mobile"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            rows={4}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
              <option value="LOW">🟢 Low</option>
              <option value="MEDIUM">🟡 Medium</option>
              <option value="HIGH">🔴 High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="OPEN">🔵 Open</option>
              <option value="IN_PROGRESS">🟠 In Progress</option>
              <option value="CLOSED">✅ Closed</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : editingIssue ? "Update Issue" : "Create Issue"}
          </button>
          {editingIssue && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default IssueForm;