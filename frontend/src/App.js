// ============================================
// File: frontend/src/App.js
// This is the ROOT component — the "brain" of the frontend.
// It manages ALL state (issues, loading, editing) and
// passes data and functions down to child components.
// Data flow:
//   App.js (state) → IssueForm, IssueList, Dashboard (display)
// ============================================

import React, { useState, useEffect, useCallback } from "react";
import Dashboard from "./components/Dashboard";
import IssueForm from "./components/IssueForm";
import IssueList from "./components/IssueList";
import {
  fetchAllIssues,
  fetchStats,
  createIssue,
  updateIssue,
  deleteIssue,
  updateIssueStatus,
} from "./api/issueApi";
import "./App.css";

function App() {
  // ---- State Variables ----
  const [issues, setIssues]           = useState([]);       // All issues from backend
  const [stats, setStats]             = useState({});        // Dashboard counts
  const [loading, setLoading]         = useState(true);      // Loading spinner
  const [editingIssue, setEditingIssue] = useState(null);   // Issue being edited (or null)
  const [notification, setNotification] = useState(null);   // Success/error toast
  const [showForm, setShowForm]       = useState(false);     // Mobile: toggle form

  // ---- Show a temporary notification toast ----
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Auto-dismiss after 3s
  };

  // ---- Load issues and stats from backend ----
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch issues and stats at the same time (parallel)
      const [issuesData, statsData] = await Promise.all([
        fetchAllIssues(),
        fetchStats(),
      ]);
      setIssues(issuesData);
      setStats(statsData);
    } catch (err) {
      showNotification("Failed to load issues. Is the backend running?", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data when the app first starts
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---- CREATE or UPDATE an issue ----
  const handleFormSubmit = async (formData) => {
    try {
      if (editingIssue) {
        // UPDATE: call PUT /api/issues/{id}
        await updateIssue(editingIssue.id, formData);
        showNotification("✅ Issue updated successfully!");
        setEditingIssue(null); // Exit edit mode
      } else {
        // CREATE: call POST /api/issues
        await createIssue(formData);
        showNotification("✅ Issue created successfully!");
      }
      // Reload all data to reflect changes
      await loadData();
      setShowForm(false);
    } catch (err) {
      showNotification(`❌ ${err.message}`, "error");
      throw err; // Re-throw so IssueForm can reset its loading state
    }
  };

  // ---- START editing an issue (pre-fill the form) ----
  const handleEdit = (issue) => {
    setEditingIssue(issue);
    setShowForm(true);
    // Scroll to the top so user sees the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- CANCEL editing ----
  const handleCancelEdit = () => {
    setEditingIssue(null);
    setShowForm(false);
  };

  // ---- DELETE an issue ----
  const handleDelete = async (id) => {
    try {
      await deleteIssue(id);
      showNotification("🗑️ Issue deleted.");
      await loadData();
    } catch (err) {
      showNotification(`❌ ${err.message}`, "error");
    }
  };

  // ---- QUICK STATUS CHANGE (from dropdown in card) ----
  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateIssueStatus(id, newStatus);
      showNotification(`Status updated to ${newStatus.replace("_", " ")}`);
      await loadData();
    } catch (err) {
      showNotification(`❌ ${err.message}`, "error");
    }
  };

  // ---- RENDER ----
  return (
    <div className="app">

      {/* ---- Top Navigation Bar ---- */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">🐛</span>
          <span className="navbar-title">IssueTracker</span>
          <span className="navbar-version">v1.0</span>
        </div>
        <div className="navbar-actions">
          <button
            className="btn btn-primary"
            onClick={() => { setEditingIssue(null); setShowForm(!showForm); }}
          >
            {showForm ? "✕ Close" : "+ New Issue"}
          </button>
        </div>
      </nav>

      {/* ---- Main Content Area ---- */}
      <main className="main-content">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Issues Dashboard</h1>
            <p className="page-subtitle">Track, manage and resolve your project issues</p>
          </div>
          <button className="btn btn-refresh" onClick={loadData} title="Refresh">
            🔄 Refresh
          </button>
        </div>

        {/* Dashboard Stats Cards */}
        <Dashboard stats={stats} />

        {/* Create/Edit Form (visible on large screens always, toggleable on mobile) */}
        <div className={`form-section ${showForm || editingIssue ? "form-visible" : ""}`}>
          <IssueForm
            onSubmit={handleFormSubmit}
            editingIssue={editingIssue}
            onCancel={handleCancelEdit}
          />
        </div>

        {/* Issues List */}
        <section className="issues-section">
          <div className="section-header">
            <h2 className="section-title">All Issues</h2>
            <span className="section-count">{issues.length} total</span>
          </div>
          <IssueList
            issues={issues}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            loading={loading}
          />
        </section>

      </main>

      {/* ---- Toast Notification ---- */}
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* ---- Footer ---- */}
      <footer className="footer">
        <p>Mini Issue Tracker • Built with React + Spring Boot + MySQL</p>
      </footer>

    </div>
  );
}

export default App;