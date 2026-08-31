import { useEffect, useMemo, useState } from "react";
import "./App.css";

<<<<<<< HEAD
const API_BASE_URL = "http://127.0.0.1:8001";

=======
>>>>>>> origin/main
function App() {
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
<<<<<<< HEAD
        setLoading(true);
        setError("");

        const [eventsResponse, analyticsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events`),
          fetch(`${API_BASE_URL}/api/analytics/summary`),
        ]);

        if (!eventsResponse.ok) {
          throw new Error(
            `Events API failed with status ${eventsResponse.status}`
          );
        }

        if (!analyticsResponse.ok) {
          throw new Error(
            `Analytics API failed with status ${analyticsResponse.status}`
          );
=======
        const [eventsResponse, analyticsResponse] = await Promise.all([
          fetch("http://localhost:8000/api/events"),
          fetch("http://localhost:8000/api/analytics/summary"),
        ]);

        if (!eventsResponse.ok || !analyticsResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
>>>>>>> origin/main
        }

        const eventsData = await eventsResponse.json();
        const analyticsData = await analyticsResponse.json();

        setEvents(eventsData);
        setAnalytics(analyticsData);
      } catch (err) {
<<<<<<< HEAD
        console.error("Dashboard error:", err);
        setError(
          "Unable to connect to the CogniStream API. Make sure FastAPI is running on port 8001."
        );
=======
        setError(err.message);
>>>>>>> origin/main
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
<<<<<<< HEAD

    const interval = setInterval(loadDashboard, 30000);

    return () => clearInterval(interval);
=======
>>>>>>> origin/main
  }, []);

  const sourceCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      counts[event.source] = (counts[event.source] || 0) + 1;
      return counts;
    }, {});
  }, [events]);

<<<<<<< HEAD
  const flowStatus = (score) => {
    if (score >= 70) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs attention";
  };

  const cognitiveStatus = (value) => {
=======
  const getFlowStatus = (value) => {
    if (value >= 70) return "Excellent";
    if (value >= 50) return "Good";
    return "Needs attention";
  };

  const getCognitiveStatus = (value) => {
>>>>>>> origin/main
    if (value <= 40) return "Healthy";
    if (value <= 60) return "Moderate";
    return "High";
  };

<<<<<<< HEAD
  const getEventStatus = (event) => {
    if (
      event.source === "Slack" ||
      event.source === "Jira"
    ) {
      return {
        label: "Context switch",
        className: "switch",
      };
    }

    if (
      event.event_type === "coding" ||
      event.event_type === "coding_start" ||
      event.event_type === "commit"
    ) {
      return {
        label: "Focused",
        className: "focused",
      };
    }

    return {
      label: "Productive",
      className: "productive",
    };
  };

  const flowPoints = useMemo(() => {
    if (!events.length) return [];

    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return sortedEvents.map((event, index) => {
      let score = 50;

      if (
        event.event_type === "coding" ||
        event.event_type === "coding_start"
      ) {
        score += 25;
      }

      if (event.event_type === "commit") {
        score += 15;
      }

      if (event.source === "Slack" || event.source === "Jira") {
        score -= 25;
      }

      score = Math.max(0, Math.min(100, score));

      return {
        ...event,
        score,
        index,
      };
    });
  }, [events]);

  const createChartPath = () => {
    if (flowPoints.length === 0) return "";

    const width = 100;
    const height = 170;

    if (flowPoints.length === 1) {
      return `M 0 ${height - flowPoints[0].score * 1.5}`;
    }

    return flowPoints
      .map((point, index) => {
        const x =
          (index / (flowPoints.length - 1)) * width;

        const y =
          height - (point.score / 100) * height;

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
=======
  const isContextSwitch = (event) => {
    return (
      event.event_type === "message" ||
      event.event_type === "ticket_update"
    );
>>>>>>> origin/main
  };

  return (
    <div className="app">
<<<<<<< HEAD
      {/* SIDEBAR */}
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

          <button className="nav-item active">
            <span>◈</span>
            Dashboard
          </button>

          <button className="nav-item">
            <span>◉</span>
            Developer Flow
          </button>

          <button className="nav-item">
            <span>⌁</span>
            Cognitive Load
          </button>

          <button className="nav-item">
            <span>↔</span>
            Context Switching
          </button>
        </div>

        <div className="sidebar-section">
          <p>DATA</p>

          <button className="nav-item">
            <span>◫</span>
            Events
          </button>

          <button className="nav-item">
            <span>⚙</span>
            Integrations
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
=======
      <header className="topbar">
        <div>
          <h1>CogniStream</h1>
          <p>Developer Analytics</p>
        </div>

        <div className="pipeline-status">
          <span className="status-dot"></span>
          Pipeline Online
          <small>All systems operational</small>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h3>WORKSPACE</h3>

          <nav>
            <a className="active">▦ Dashboard</a>
            <a>◉ Developer Flow</a>
            <a>⌁ Cognitive Load</a>
            <a>↔ Context Switching</a>
          </nav>

          <h3>DATA</h3>

          <nav>
            <a>◫ Events</a>
            <a>⚙ Integrations</a>
          </nav>
        </aside>

        <main className="main-content">
          <section className="developer-card">
>>>>>>> origin/main
            <div className="avatar">K</div>

            <div>
              <strong>DEV001</strong>
<<<<<<< HEAD
              <small>Developer</small>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              DEVELOPER WORKSPACE
            </span>

            <h1>Flow-State Overview</h1>

            <p>
              Monitor developer productivity, cognitive load
              and context switching in real time.
            </p>
          </div>

          <div className="top-actions">
            <button className="date-button">
              Today
            </button>

            <div className="live">
              <span></span>
              Live
            </div>
          </div>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="card" style={{ padding: "25px" }}>
            Loading CogniStream analytics...
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div
            className="card"
            style={{
              padding: "25px",
              color: "#b04b4b",
            }}
          >
            {error}
          </div>
        )}

        {/* DASHBOARD */}
        {!loading && !error && analytics && (
          <>
            {/* METRICS */}
            <section className="metrics">
              <div className="metric-card">
                <span className="metric-title">
                  Flow Score
                </span>

                <div className="metric-value">
                  {analytics.flow_score}%
                </div>

                <span className="metric-label">
                  {flowStatus(analytics.flow_score)}
                </span>

                <p>
                  Calculated from developer activity
                </p>
              </div>

              <div className="metric-card">
                <span className="metric-title">
                  Cognitive Load
                </span>

                <div className="metric-value">
                  {analytics.cognitive_load}%
                </div>

                <span className="metric-label">
                  {cognitiveStatus(
                    analytics.cognitive_load
                  )}
                </span>

                <p>
                  Based on current developer events
                </p>
              </div>

              <div className="metric-card">
                <span className="metric-title">
                  Context Switches
                </span>

                <div className="metric-value">
                  {analytics.context_switches}
                </div>

                <span className="metric-label">
                  {analytics.context_switches <= 2
                    ? "Low"
                    : "High"}
                </span>

                <p>
                  During the current session
                </p>
              </div>

              <div className="metric-card">
                <span className="metric-title">
                  Productive Events
                </span>

                <div className="metric-value">
                  {analytics.productive_events}
                </div>

                <span className="metric-label positive">
                  On track
                </span>

                <p>
                  Productive developer activities
                </p>
              </div>
            </section>

            {/* FLOW CHART */}
            <section className="card flow-card">
              <div className="card-header">
                <div>
                  <span className="section-label">
                    ANALYTICS
                  </span>

                  <h2>Developer Flow</h2>
                </div>

                <span className="today-label">
                  Today
                </span>
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
                    viewBox="0 0 100 170"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="flowGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    <path
                      className="flow-area"
                      d={
                        flowPoints.length
                          ? `${createChartPath()} L 100 170 L 0 170 Z`
                          : ""
                      }
                    />

                    <path
                      className="flow-line"
                      d={createChartPath()}
                    />
                  </svg>

                  <div className="x-axis">
                    {flowPoints.map((point) => (
                      <span key={point.timestamp}>
                        {formatTime(point.timestamp)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* LOWER CARDS */}
            <section className="dashboard-grid">
              {/* ACTIVITY */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <span className="section-label">
                      ACTIVITY
                    </span>

                    <h2>Activity Distribution</h2>
                  </div>

                  <span className="event-count">
                    {analytics.total_events}
                  </span>
                </div>

                <div className="activity-content">
                  <div className="donut">
                    <div className="donut-inner">
                      <strong>
                        {analytics.total_events}
                      </strong>

                      <span>Events</span>
                    </div>
=======
              <span>Developer</span>
            </div>
          </section>

          <section className="hero-section">
            <p className="eyebrow">DEVELOPER WORKSPACE</p>

            <h2>Flow-State Overview</h2>

            <p className="description">
              Monitor developer productivity, cognitive load and context
              switching in real time.
            </p>
          </section>

          {loading && (
            <div className="info-box">
              Loading analytics...
            </div>
          )}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {!loading && !error && analytics && (
            <>
              <section className="metrics-grid">
                <div className="metric-card">
                  <span>Flow Score</span>

                  <strong>{analytics.flow_score}%</strong>

                  <small>
                    Calculated from developer activity
                  </small>

                  <b>
                    {getFlowStatus(analytics.flow_score)}
                  </b>
                </div>

                <div className="metric-card">
                  <span>Cognitive Load</span>

                  <strong>{analytics.cognitive_load}%</strong>

                  <small>
                    Based on current developer events
                  </small>

                  <b>
                    {getCognitiveStatus(analytics.cognitive_load)}
                  </b>
                </div>

                <div className="metric-card">
                  <span>Context Switches</span>

                  <strong>{analytics.context_switches}</strong>

                  <small>
                    During the current session
                  </small>

                  <b>
                    {analytics.context_switches <= 2
                      ? "Low"
                      : "High"}
                  </b>
                </div>

                <div className="metric-card">
                  <span>Productive Events</span>

                  <strong>{analytics.productive_events}</strong>

                  <small>
                    Productive developer activities
                  </small>

                  <b>On track</b>
                </div>
              </section>

              <section className="content-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>Developer Flow</h3>
                      <p>Flow & Cognitive Load</p>
                    </div>

                    <span>Today</span>
                  </div>

                  <div className="flow-summary">
                    <div>
                      <span>Flow Score</span>
                      <strong>
                        {analytics.flow_score}%
                      </strong>
                    </div>

                    <div>
                      <span>Cognitive Load</span>
                      <strong>
                        {analytics.cognitive_load}%
                      </strong>
                    </div>

                    <div>
                      <span>Context Switches</span>
                      <strong>
                        {analytics.context_switches}
                      </strong>
                    </div>
                  </div>

                  <div className="chart">
                    <div className="chart-line"></div>
                    <div className="chart-line"></div>
                    <div className="chart-line"></div>
                    <div className="chart-line"></div>

                    <div className="chart-labels">
                      <span>09:00</span>
                      <span>09:30</span>
                      <span>10:00</span>
                      <span>10:30</span>
                      <span>11:00</span>
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>Activity Distribution</h3>
                      <p>Event Sources</p>
                    </div>

                    <strong>
                      {analytics.total_events}
                    </strong>
>>>>>>> origin/main
                  </div>

                  <div className="source-list">
                    {Object.entries(sourceCounts).map(
                      ([source, count]) => (
                        <div
                          className="source-row"
                          key={source}
                        >
<<<<<<< HEAD
                          <span className="source-dot">
                            {source.charAt(0)}
                          </span>

                          <span>{source}</span>

=======
                          <span>{source}</span>
>>>>>>> origin/main
                          <strong>{count}</strong>
                        </div>
                      )
                    )}
                  </div>
                </div>
<<<<<<< HEAD
              </div>

              {/* EVENTS BY SOURCE */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <span className="section-label">
                      SOURCES
                    </span>

                    <h2>Events by Source</h2>
                  </div>
                </div>

                <div className="bars">
                  {Object.entries(sourceCounts).map(
                    ([source, count]) => {
                      const percentage =
                        (count /
                          analytics.total_events) *
                        100;

                      return (
                        <div
                          className="bar-row"
                          key={source}
                        >
                          <span>{source}</span>

                          <div className="bar-track">
                            <div
                              className="bar"
                              style={{
                                width: `${percentage}%`,
                              }}
                            ></div>
                          </div>

                          <strong>{count}</strong>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* PRODUCTIVITY */}
              <div className="card productivity-card">
                <div className="card-header">
                  <div>
                    <span className="section-label">
                      PRODUCTIVITY
                    </span>

                    <h2>Session Health</h2>
                  </div>

                  <span className="health-badge">
                    {cognitiveStatus(
                      analytics.cognitive_load
                    )}
                  </span>
                </div>

                <div className="indicator">
                  <div className="indicator-top">
                    <span>Focus time</span>

=======
              </section>

              <section className="content-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>Events by Source</h3>

                      <p>
                        {analytics.total_events} processed
                      </p>
                    </div>
                  </div>

                  <div className="source-cards">
                    {Object.entries(sourceCounts).map(
                      ([source, count]) => (
                        <div
                          className="source-card"
                          key={source}
                        >
                          <strong>{count}</strong>
                          <span>{source}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>Productivity Indicators</h3>
                      <p>Session Health</p>
                    </div>

                    <b>
                      {analytics.cognitive_load <= 40
                        ? "Healthy"
                        : "Needs attention"}
                    </b>
                  </div>

                  <div className="indicator">
                    <span>Focus time</span>
>>>>>>> origin/main
                    <strong>
                      {analytics.focus_time_percent}%
                    </strong>
                  </div>

<<<<<<< HEAD
                  <div className="indicator-track">
                    <div
                      className="indicator-fill"
                      style={{
                        width: `${analytics.focus_time_percent}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="indicator">
                  <div className="indicator-top">
                    <span>Deep work</span>

=======
                  <div className="indicator">
                    <span>Deep work</span>
>>>>>>> origin/main
                    <strong>
                      {analytics.deep_work_percent}%
                    </strong>
                  </div>

<<<<<<< HEAD
                  <div className="indicator-track">
                    <div
                      className="indicator-fill"
                      style={{
                        width: `${analytics.deep_work_percent}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="indicator">
                  <div className="indicator-top">
                    <span>Communication load</span>

                    <strong>
                      {
                        analytics.communication_load_percent
                      }
                      %
                    </strong>
                  </div>

                  <div className="indicator-track">
                    <div
                      className="indicator-fill"
                      style={{
                        width: `${analytics.communication_load_percent}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="indicator">
                  <div className="indicator-top">
                    <span>Cognitive load</span>

=======
                  <div className="indicator">
                    <span>Communication load</span>
                    <strong>
                      {analytics.communication_load_percent}%
                    </strong>
                  </div>

                  <div className="indicator">
                    <span>Cognitive load</span>
>>>>>>> origin/main
                    <strong>
                      {analytics.cognitive_load}%
                    </strong>
                  </div>
<<<<<<< HEAD

                  <div className="indicator-track">
                    <div
                      className="indicator-fill"
                      style={{
                        width: `${analytics.cognitive_load}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* LIVE EVENTS */}
            <section className="card events-card">
              <div className="card-header">
                <div>
                  <span className="section-label">
                    ACTIVITY STREAM
                  </span>

                  <h2>Live Activity</h2>
                </div>

                <span className="event-count">
                  {events.length} events
                </span>
              </div>

              <div className="table">
                <div className="table-head">
                  <span>TIME</span>
                  <span>SOURCE</span>
                  <span>EVENT</span>
                  <span>STATUS</span>
                </div>

                {events.map((event) => {
                  const status = getEventStatus(event);

                  return (
                    <div
                      className="table-row"
                      key={`${event.timestamp}-${event.source}-${event.event_type}`}
                    >
                      <span className="time">
                        {formatTime(event.timestamp)}
                      </span>

                      <span className="source-name">
                        <span className="event-icon">
                          {event.source.charAt(0)}
                        </span>

                        {event.source}
                      </span>

                      <span>
                        {event.event_type}
                      </span>

                      <span
                        className={`status ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        <footer>
          <span>
            CogniStream • Developer Flow & Cognitive
            Load Analytics
          </span>

          <span>
            Pipeline: Python → Polars → ClickHouse →
            FastAPI → React
          </span>
        </footer>
      </main>
=======
                </div>
              </section>

              <section className="panel events-panel">
                <div className="panel-header">
                  <div>
                    <h3>Live Activity</h3>
                    <p>Recent Developer Events</p>
                  </div>

                  <strong>
                    {events.length} events
                  </strong>
                </div>

                <div className="events-table">
                  <div className="table-header">
                    <span>TIME</span>
                    <span>SOURCE</span>
                    <span>EVENT</span>
                    <span>STATUS</span>
                  </div>

                  {events.map((event) => {
                    const contextSwitch =
                      isContextSwitch(event);

                    return (
                      <div
                        className="table-row"
                        key={
                          event.timestamp +
                          "-" +
                          event.source
                        }
                      >
                        <span>
                          {new Date(
                            event.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </span>

                        <span>{event.source}</span>

                        <span>{event.event_type}</span>

                        <span
                          className={
                            contextSwitch
                              ? "context"
                              : "focused"
                          }
                        >
                          {contextSwitch
                            ? "Context switch"
                            : "Focused"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}

          <footer>
            <span>
              CogniStream • Developer Flow & Cognitive Load Analytics
            </span>

            <span>
              Pipeline: Python → Polars → ClickHouse → FastAPI → React
            </span>
          </footer>
        </main>
      </div>
>>>>>>> origin/main
    </div>
  );
}

export default App;