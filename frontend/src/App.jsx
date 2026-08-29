import { useState } from "react";
import "./App.css";

const events = [
  {
    time: "09:00",
    source: "VSCode",
    event: "coding_start",
    status: "Focused",
  },
  {
    time: "09:45",
    source: "Slack",
    event: "message",
    status: "Context switch",
  },
  {
    time: "09:50",
    source: "VSCode",
    event: "coding",
    status: "Focused",
  },
  {
    time: "10:30",
    source: "GitHub",
    event: "commit",
    status: "Productive",
  },
  {
    time: "11:00",
    source: "Jira",
    event: "ticket_update",
    status: "Context switch",
  },
];

const sourceCounts = [
  { name: "VSCode", count: 2 },
  { name: "Slack", count: 1 },
  { name: "GitHub", count: 1 },
  { name: "Jira", count: 1 },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">C</div>
          <div>
            <h2>CogniStream</h2>
            <span>Developer Analytics</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p>WORKSPACE</p>

          <button
            className={`nav-item ${
              activePage === "Dashboard" ? "active" : ""
            }`}
            onClick={() => setActivePage("Dashboard")}
          >
            ▦ <span>Dashboard</span>
          </button>

          <button
            className={`nav-item ${
              activePage === "Developer Flow" ? "active" : ""
            }`}
            onClick={() => setActivePage("Developer Flow")}
          >
            ◉ <span>Developer Flow</span>
          </button>

          <button
            className={`nav-item ${
              activePage === "Cognitive Load" ? "active" : ""
            }`}
            onClick={() => setActivePage("Cognitive Load")}
          >
            ⌁ <span>Cognitive Load</span>
          </button>

          <button
            className={`nav-item ${
              activePage === "Context Switching" ? "active" : ""
            }`}
            onClick={() => setActivePage("Context Switching")}
          >
            ↔ <span>Context Switching</span>
          </button>
        </div>

        <div className="sidebar-section">
          <p>DATA</p>

          <button
            className={`nav-item ${activePage === "Events" ? "active" : ""}`}
            onClick={() => setActivePage("Events")}
          >
            ◫ <span>Events</span>
          </button>

          <button
            className={`nav-item ${
              activePage === "Integrations" ? "active" : ""
            }`}
            onClick={() => setActivePage("Integrations")}
          >
            ⚙ <span>Integrations</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="pipeline">
            <span className="online-dot"></span>
            <div>
              <strong>Pipeline Online</strong>
              <small>All systems operational</small>
            </div>
          </div>

          <div className="developer-mini">
            <div className="avatar">K</div>
            <div>
              <strong>DEV001</strong>
              <small>Developer</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">DEVELOPER WORKSPACE</span>
            <h1>Flow-State Overview</h1>
            <p>
              Monitor developer productivity, cognitive load and context
              switching in real time.
            </p>
          </div>

          <div className="top-actions">
            <button className="date-button">Today ▾</button>
            <span className="live">
              <span></span> Live
            </span>
          </div>
        </header>

        {/* Metric Cards */}
        <section className="metrics">
          <MetricCard
            title="Flow Score"
            value="82%"
            label="Excellent"
            change="+8.4% compared with yesterday"
            positive
          />

          <MetricCard
            title="Cognitive Load"
            value="34%"
            label="Healthy"
            change="Low cognitive pressure detected"
          />

          <MetricCard
            title="Context Switches"
            value="2"
            label="Low"
            change="During the current session"
          />

          <MetricCard
            title="Productive Time"
            value="3h 42m"
            label="On track"
            change="82% of tracked work session"
          />
        </section>

        {/* Flow chart */}
        <section className="card flow-card">
          <div className="card-header">
            <div>
              <span className="section-label">Developer Flow</span>
              <h2>Flow & Cognitive Load</h2>
            </div>
            <span className="today-label">Today</span>
          </div>

          <div className="chart">
            <div className="y-axis">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            <div className="chart-area">
              <div className="grid-line line-100"></div>
              <div className="grid-line line-75"></div>
              <div className="grid-line line-50"></div>
              <div className="grid-line line-25"></div>
              <div className="grid-line line-0"></div>

              <svg
                className="flow-svg"
                viewBox="0 0 700 220"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="flowGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopOpacity="0.25" />
                    <stop offset="100%" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  className="flow-area"
                  d="M0,75 C80,60 120,105 190,85 C260,65 290,115 350,90 C430,58 470,92 530,72 C600,50 650,68 700,45 L700,220 L0,220 Z"
                />

                <path
                  className="flow-line"
                  d="M0,75 C80,60 120,105 190,85 C260,65 290,115 350,90 C430,58 470,92 530,72 C600,50 650,68 700,45"
                />
              </svg>

              <div className="x-axis">
                <span>09:00</span>
                <span>09:30</span>
                <span>10:00</span>
                <span>10:30</span>
                <span>11:00</span>
              </div>
            </div>
          </div>
        </section>

        <div className="dashboard-grid">
          {/* Activity Distribution */}
          <section className="card">
            <div className="card-header">
              <div>
                <span className="section-label">Activity Distribution</span>
                <h2>Event Sources</h2>
              </div>
            </div>

            <div className="activity-content">
              <div className="donut">
                <div className="donut-inner">
                  <strong>5</strong>
                  <span>Total events</span>
                </div>
              </div>

              <div className="source-list">
                {sourceCounts.map((source) => (
                  <div className="source-row" key={source.name}>
                    <span className={`source-dot ${source.name.toLowerCase()}`}>
                      {source.name.charAt(0)}
                    </span>
                    <span>{source.name}</span>
                    <strong>{source.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Events by source */}
          <section className="card">
            <div className="card-header">
              <div>
                <span className="section-label">Events by Source</span>
                <h2>5 processed</h2>
              </div>
            </div>

            <div className="bars">
              {sourceCounts.map((source) => (
                <div className="bar-row" key={source.name}>
                  <span>{source.name}</span>
                  <div className="bar-track">
                    <div
                      className="bar"
                      style={{
                        width: `${(source.count / 2) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <strong>{source.count}</strong>
                </div>
              ))}
            </div>
          </section>

          {/* Productivity */}
          <section className="card productivity-card">
            <div className="card-header">
              <div>
                <span className="section-label">Session Health</span>
                <h2>Productivity Indicators</h2>
              </div>

              <span className="health-badge">Healthy</span>
            </div>

            <Indicator label="Focus time" value={82} />
            <Indicator label="Deep work" value={74} />
            <Indicator label="Communication load" value={31} />
            <Indicator label="Cognitive load" value={34} />
          </section>
        </div>

        {/* Recent Events */}
        <section className="card events-card">
          <div className="card-header">
            <div>
              <span className="section-label">Live Activity</span>
              <h2>Recent Developer Events</h2>
            </div>

            <span className="event-count">5 events</span>
          </div>

          <div className="table">
            <div className="table-head">
              <span>TIME</span>
              <span>SOURCE</span>
              <span>EVENT</span>
              <span>STATUS</span>
            </div>

            {events.map((event, index) => (
              <div className="table-row" key={index}>
                <span className="time">{event.time}</span>

                <span className="source-name">
                  <span className={`event-icon ${event.source.toLowerCase()}`}>
                    {event.source.charAt(0)}
                  </span>
                  {event.source}
                </span>

                <span>{event.event}</span>

                <span>
                  <span
                    className={`status ${
                      event.status === "Context switch"
                        ? "switch"
                        : event.status === "Productive"
                        ? "productive"
                        : "focused"
                    }`}
                  >
                    {event.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <footer>
          <strong>CogniStream</strong> • Developer Flow & Cognitive Load
          Analytics
          <span>Pipeline: Python → Polars → ClickHouse</span>
        </footer>
      </main>
    </div>
  );
}

function MetricCard({ title, value, label, change, positive }) {
  return (
    <div className="metric-card">
      <span className="metric-title">{title}</span>
      <div className="metric-value">{value}</div>
      <span className="metric-label">{label}</span>
      <p className={positive ? "positive" : ""}>{change}</p>
    </div>
  );
}

function Indicator({ label, value }) {
  return (
    <div className="indicator">
      <div className="indicator-top">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div className="indicator-track">
        <div
          className="indicator-fill"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

export default App;