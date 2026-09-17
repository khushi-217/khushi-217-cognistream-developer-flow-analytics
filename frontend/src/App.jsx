import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8001";

function App() {
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [contextSwitches, setContextSwitches] = useState([]);
  const [flowBlocks, setFlowBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [eventsResponse, analyticsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events`),
          fetch(`${API_BASE_URL}/api/analytics/summary`),
        ]);

        if (!eventsResponse.ok || !analyticsResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const eventsData = await eventsResponse.json();
        const analyticsData = await analyticsResponse.json();

        setEvents(eventsData);
        setAnalytics(analyticsData);

        try {
          const contextResponse = await fetch(
            `${API_BASE_URL}/api/analytics/context-switches`
          );

          if (contextResponse.ok) {
            setContextSwitches(await contextResponse.json());
          } else {
            setContextSwitches([]);
          }
        } catch {
          setContextSwitches([]);
        }

        try {
          const flowResponse = await fetch(
            `${API_BASE_URL}/api/analytics/flow-blocks`
          );

          if (flowResponse.ok) {
            setFlowBlocks(await flowResponse.json());
          } else {
            setFlowBlocks([]);
          }
        } catch {
          setFlowBlocks([]);
        }
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const sourceCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      const source = event.source || "Unknown";
      counts[source] = (counts[source] || 0) + 1;
      return counts;
    }, {});
  }, [events]);

  const flowStatus = analytics
    ? analytics.flow_score >= 70
      ? "Strong"
      : analytics.flow_score >= 40
        ? "Moderate"
        : "Low"
    : "—";

  const cognitiveStatus = analytics
    ? analytics.cognitive_load <= 30
      ? "Low"
      : analytics.cognitive_load <= 60
        ? "Moderate"
        : "High"
    : "—";

  const getEventStatus = (event) => {
    if (event.event_type === "commit") {
      return "Productive";
    }

    if (
      event.event_type === "coding" ||
      event.event_type === "coding_start"
    ) {
      return "Focused";
    }

    if (
      event.source === "Slack" ||
      event.source === "Jira" ||
      event.event_type === "communication"
    ) {
      return "Interrupting";
    }

    return "Active";
  };

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "—";
    }

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const flowPoints = useMemo(() => {
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return sortedEvents.reduce(
      (result, event) => {
        let nextScore = result.score;

        if (
          event.event_type === "coding" ||
          event.event_type === "coding_start"
        ) {
          nextScore += 25;
        }

        if (event.event_type === "commit") {
          nextScore += 15;
        }

        if (event.source === "Slack" || event.source === "Jira") {
          nextScore -= 25;
        }

        nextScore = Math.max(0, Math.min(100, nextScore));

        result.points.push({
          time: formatTime(event.timestamp),
          score: nextScore,
        });

        return {
          score: nextScore,
          points: result.points,
        };
      },
      { score: 50, points: [] }
    ).points;
  }, [events]);

  const createChartPath = () => {
    if (flowPoints.length === 0) {
      return "";
    }

    const width = 760;
    const height = 220;
    const padding = 20;

    return flowPoints
      .map((point, index) => {
        const x =
          flowPoints.length === 1
            ? width / 2
            : padding +
              (index / (flowPoints.length - 1)) * (width - padding * 2);

        const y =
          height -
          padding -
          (point.score / 100) * (height - padding * 2);

        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-screen">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-title">CogniStream</div>
            <div className="brand-subtitle">Developer Analytics</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span>◉</span>
            Overview
          </button>
          <button className="nav-item">
            <span>◌</span>
            Flow State
          </button>
          <button className="nav-item">
            <span>↔</span>
            Context Switches
          </button>
          <button className="nav-item">
            <span>▣</span>
            Activity
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">K</div>
          <div>
            <div className="user-name">Developer</div>
            <div className="user-role">Analytics View</div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Analytics / <span>Today</span>
          </div>

          <div className="topbar-actions">
            <button className="topbar-button">Today</button>
            <div className="live-indicator">
              <span className="live-dot"></span>
              Live
            </div>
          </div>
        </header>

        <section className="page-header">
          <div>
            <span className="section-label">COGNISTREAM</span>
            <h1>Flow-State Overview</h1>
            <p>
              Monitor developer focus, cognitive load, and context switching.
            </p>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="metric-card">
            <span className="metric-label">FLOW SCORE</span>
            <div className="metric-value">
              {analytics?.flow_score ?? 0}
              <span className="metric-unit">/100</span>
            </div>
            <div className="metric-status">{flowStatus}</div>
          </div>

          <div className="metric-card">
            <span className="metric-label">COGNITIVE LOAD</span>
            <div className="metric-value">
              {analytics?.cognitive_load ?? 0}
              <span className="metric-unit">%</span>
            </div>
            <div className="metric-status">{cognitiveStatus}</div>
          </div>

          <div className="metric-card">
            <span className="metric-label">CONTEXT SWITCHES</span>
            <div className="metric-value">
              {analytics?.context_switches ?? 0}
            </div>
            <div className="metric-status">Detected</div>
          </div>

          <div className="metric-card">
            <span className="metric-label">PRODUCTIVE EVENTS</span>
            <div className="metric-value">
              {analytics?.productive_events ?? 0}
            </div>
            <div className="metric-status">Tracked</div>
          </div>

          <div className="metric-card">
            <span className="metric-label">TOTAL COMMITS</span>
            <div className="metric-value">
              {analytics?.total_commits ?? 0}
            </div>
            <div className="metric-status">Tracked</div>
          </div>
        </section>

        <section className="card flow-card">
          <div className="card-header">
            <div>
              <span className="section-label">FLOW STATE</span>
              <h2>Developer Flow</h2>
            </div>

            <div className="chart-legend">
              <span className="legend-dot"></span>
              Flow score
            </div>
          </div>

          <div className="chart-area">
            {flowPoints.length > 0 ? (
              <>
                <div className="flow-scale">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>

                <svg
                  className="chart"
                  viewBox="0 0 760 220"
                  preserveAspectRatio="none"
                >
                  <line
                    x1="20"
                    y1="20"
                    x2="740"
                    y2="20"
                    className="chart-grid-line"
                  />

                  <line
                    x1="20"
                    y1="110"
                    x2="740"
                    y2="110"
                    className="chart-grid-line"
                  />

                  <line
                    x1="20"
                    y1="200"
                    x2="740"
                    y2="200"
                    className="chart-grid-line"
                  />

                  <path
                    d={createChartPath()}
                    className="flow-line"
                    fill="none"
                  />

                  {flowPoints.map((point, index) => {
                    const x =
                      flowPoints.length === 1
                        ? 380
                        : 20 +
                          (index / (flowPoints.length - 1)) * 720;

                    const y = 200 - (point.score / 100) * 180;

                    return (
                      <circle
                        key={`${point.time}-${index}`}
                        cx={x}
                        cy={y}
                        r="5"
                        className="flow-point"
                      />
                    );
                  })}
                </svg>

                <div className="flow-time-labels">
                  {flowPoints.map((point, index) => {
                    if (
                      flowPoints.length > 6 &&
                      index !== 0 &&
                      index !== flowPoints.length - 1 &&
                      index % 2 !== 0
                    ) {
                      return null;
                    }

                    return (
                      <span key={`${point.time}-label-${index}`}>
                        {point.time}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="empty-state">No flow data available.</div>
            )}
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">ANALYTICS</span>
                <h2>Interruption Sources</h2>
              </div>
            </div>

            {contextSwitches.length > 0 ? (
              <>
                <div className="interruption-bars">
                  {[
                    {
                      label: "Slack",
                      value: contextSwitches.filter(
                        (item) => item.to_source === "Slack"
                      ).length,
                    },
                    {
                      label: "Jira",
                      value: contextSwitches.filter(
                        (item) => item.to_source === "Jira"
                      ).length,
                    },
                  ].map((item) => {
                    const maxValue = Math.max(
                      contextSwitches.filter(
                        (event) => event.to_source === "Slack"
                      ).length,
                      contextSwitches.filter(
                        (event) => event.to_source === "Jira"
                      ).length,
                      1
                    );

                    return (
                      <div key={item.label} className="interruption-item">
                        <div className="interruption-label">
                          <span>{item.label}</span>
                          <strong>{item.value} switches</strong>
                        </div>

                        <div className="interruption-track">
                          <div
                            className="interruption-fill"
                            style={{
                              width: `${(item.value / maxValue) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="context-switch-list">
                  {contextSwitches.map((switchEvent, index) => (
                    <div
                      className="context-switch-item"
                      key={`${switchEvent.timestamp}-${index}`}
                    >
                      <div>
                        <strong>
                          {switchEvent.from_source} →{" "}
                          {switchEvent.to_source}
                        </strong>
                        <span>{formatTime(switchEvent.timestamp)}</span>
                      </div>

                      <span className="switch-duration">
                        {switchEvent.duration_seconds ?? 0}s
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                No context switches detected.
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">FLOW</span>
                <h2>Uninterrupted Flow Blocks</h2>
              </div>
            </div>

            {flowBlocks.length > 0 ? (
              <div className="flow-block-list">
                {flowBlocks.map((block, index) => (
                  <div
                    className="flow-block-item"
                    key={`${block.start_time}-${index}`}
                  >
                    <div>
                      <strong>
                        {formatTime(block.start_time)} →{" "}
                        {formatTime(block.end_time)}
                      </strong>
                      <span>
                        {block.duration_minutes ?? 0} min uninterrupted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No uninterrupted flow blocks detected.
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">ANALYTICS</span>
                <h2>Activity Ratio Breakdown</h2>
              </div>
            </div>

            <div className="activity-ratio-list">
              {[
                {
                  label: "Coding",
                  value: analytics?.coding_events || 0,
                },
                {
                  label: "Communication",
                  value: analytics?.communication_events || 0,
                },
                {
                  label: "Productive",
                  value: analytics?.productive_events || 0,
                },
              ].map((item) => {
                const totalEvents = analytics?.total_events || events.length || 0;
                const percentage =
                  totalEvents > 0
                    ? Math.round((item.value / totalEvents) * 100)
                    : 0;

                return (
                  <div key={item.label} className="activity-ratio-item">
                    <div className="activity-ratio-label">
                      <span>{item.label}</span>
                      <strong>
                        {item.value} events · {percentage}%
                      </strong>
                    </div>

                    <div className="activity-ratio-track">
                      <div
                        className="activity-ratio-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">ACTIVITY</span>
                <h2>Activity Distribution</h2>
              </div>
            </div>

            <div className="stats-list">
              <div className="stats-row">
                <span>Coding</span>
                <strong>{analytics?.coding_events ?? 0}</strong>
              </div>

              <div className="stats-row">
                <span>Communication</span>
                <strong>{analytics?.communication_events ?? 0}</strong>
              </div>

              <div className="stats-row">
                <span>Productive</span>
                <strong>{analytics?.productive_events ?? 0}</strong>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">SOURCES</span>
                <h2>Events by Source</h2>
              </div>
            </div>

            <div className="stats-list">
              {Object.entries(sourceCounts).map(([source, count]) => (
                <div className="stats-row" key={source}>
                  <span>{source}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">HEALTH</span>
                <h2>Session Health</h2>
              </div>
            </div>

            <div className="stats-list">
              <div className="stats-row">
                <span>Focus Time</span>
                <strong>{analytics?.focus_time_percent ?? 0}%</strong>
              </div>

              <div className="stats-row">
                <span>Deep Work</span>
                <strong>{analytics?.deep_work_percent ?? 0}%</strong>
              </div>

              <div className="stats-row">
                <span>Communication Load</span>
                <strong>
                  {analytics?.communication_load_percent ?? 0}%
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="card recent-events-card">
          <div className="card-header">
            <div>
              <span className="section-label">LIVE ACTIVITY</span>
              <h2>Recent Events</h2>
            </div>
          </div>

          <div className="activity-table">
            <div className="activity-table-header">
              <span>Time</span>
              <span>Source</span>
              <span>Event</span>
              <span>Status</span>
            </div>

            {events.length > 0 ? (
              [...events]
                .sort(
                  (a, b) =>
                    new Date(b.timestamp) - new Date(a.timestamp)
                )
                .map((event, index) => (
                  <div
                    className="activity-table-row"
                    key={`${event.timestamp}-${index}`}
                  >
                    <span>{formatTime(event.timestamp)}</span>
                    <span>{event.source || "Unknown"}</span>
                    <span>{event.event_type || "Activity"}</span>
                    <span className="status-badge">
                      {getEventStatus(event)}
                    </span>
                  </div>
                ))
            ) : (
              <div className="empty-state">No activity available.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
