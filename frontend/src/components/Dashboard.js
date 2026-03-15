import React from "react";

function Dashboard({ stats }) {
  const cards = [
    { label: "Total Issues", value: stats.total ?? 0, icon: "📊", colorClass: "stat-total" },
    { label: "Open", value: stats.open ?? 0, icon: "🔵", colorClass: "stat-open" },
    { label: "In Progress", value: stats.inProgress ?? 0, icon: "🟠", colorClass: "stat-progress" },
    { label: "Closed", value: stats.closed ?? 0, icon: "✅", colorClass: "stat-closed" },
  ];

  return (
    <div className="dashboard-stats">
      {cards.map((card) => (
        <div key={card.label} className={`stat-card ${card.colorClass}`}>
          <div className="stat-icon">{card.icon}</div>
          <div className="stat-info">
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;