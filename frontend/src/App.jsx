import { useEffect, useMemo, useState } from "react";
import { BarChart } from "@tremor/react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8001";

function App() {
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [contextSwitches, setContextSwitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
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
        }

        const eventsData = await eventsResponse.json();
        const analyticsData = await analyticsResponse.json();

        setEvents(eventsData);
        setAnalytics(analyticsData);

        // Context-switch analytics are loaded separately so that
        // an issue with this endpoint does not break the main dashboard.
        try {
          const contextSwitchResponse = await fetch(
            `${API_BASE_URL}/api/analytics/context-switches`
          );

          if (!contextSwitchResponse.ok) {
            throw new Error(
              `Context switch API failed with status ${contextSwitchResponse.status}`
            );
          }

          const contextSwitchData = await contextSwitchResponse.json();

          if (!Array.isArray(contextSwitchData)) {
            throw new Error("Context switch API returned invalid data");
          }

          setContextSwitches(contextSwitchData);
        } catch (contextError) {
          console.error(
            "Context switching analytics error:",
            contextError
          );
          setContextSwitches([]);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(
          "Unable to connect to the CogniStream API. Make sure FastAPI is running on port 8001."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();

    const interval = setInterval(loadDashboard, 30000);

    return () => clearInterval(interval);
  }, []);

  const sourceCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      counts[event.source] = (counts[event.source] || 0) + 1;
      return counts;
    }, {});
  }, [events]);

  const flowStatus = (score) => {
    if (score >= 70) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs attention";
  };

  const cognitiveStatus = (value) => {
    if (value <= 40) return "Healthy";
    if (value <= 60) return "Moderate";
    return "High";
  };

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
  };

  const contextSwitchChartData = useMemo(() => {
    return contextSwitches.map((switchEvent) => ({
      time: formatTime(switchEvent.timestamp),
      Slack: switchEvent.to_source === "Slack" ? 1 : 0,
      Jira: switchEvent.to_source === "Jira" ? 1 : 0,
    }));
  }, [contextSwitches]);

  return (
    <div className="app">
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
            <div className="avatar">K</div>

            <div>
              <strong>DEV001</strong>
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

            {/* CONTEXT SWITCHING */}
            <section className="card context-switch-card">
              <div className="card-header">
                <div>
                  <span className="section-label">
                    CONTEXT SWITCHING
                  </span>

                  <h2>Interruption Sources</h2>
                </div>

                <span className="today-label">
                  {contextSwitches.length} switches
                </span>
              </div>

              {contextSwitches.length > 0 ? (
                <>
                  <BarChart
                    data={contextSwitchChartData}
                    index="time"
                    categories={["Slack", "Jira"]}
                    colors={["blue", "amber"]}
                    yAxisWidth={40}
                    showLegend={true}
                    showGridLines={true}
                    showAnimation={true}
                    autoMinValue={0}
                    valueFormatter={(value) => `${value}`}
                  />

                  <div className="context-switch-list">
                    {contextSwitches.map((switchEvent) => (
                      <div
                        className="context-switch-row"
                        key={`${switchEvent.timestamp}-${switchEvent.from_source}-${switchEvent.to_source}`}
                      >
                        <span className="time">
                          {formatTime(
                            switchEvent.timestamp
                          )}
                        </span>

                        <span>
                          {switchEvent.from_source}
                        </span>

                        <span>→</span>

                        <strong>
                          {switchEvent.to_source}
                        </strong>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  No context switches detected.
                </div>
              )}
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
                  </div>

                  <div className="source-list">
                    {Object.entries(sourceCounts).map(
                      ([source, count]) => (
                        <div
                          className="source-row"
                          key={source}
                        >
                          <span className="source-dot">
                            {source.charAt(0)}
                          </span>

                          <span>{source}</span>

                          <strong>{count}</strong>
                        </div>
                      )
                    )}
                  </div>
                </div>
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
                        analytics.total_events > 0
                          ? (count /
                              analytics.total_events) *
                            100
                          : 0;

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

                    <strong>
                      {analytics.focus_time_percent}%
                    </strong>
                  </div>

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

                    <strong>
                      {analytics.deep_work_percent}%
                    </strong>
                  </div>

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

                    <strong>
                      {analytics.cognitive_load}%
                    </strong>
                  </div>

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
    </div>
  );
}

export default App;