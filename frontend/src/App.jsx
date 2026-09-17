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
          const response = await fetch(
            `${API_BASE_URL}/api/analytics/context-switches`
          );
          setContextSwitches(response.ok ? await response.json() : []);
        } catch {
          setContextSwitches([]);
        }

        try {
          const response = await fetch(
            `${API_BASE_URL}/api/analytics/flow-blocks`
          );
          setFlowBlocks(response.ok ? await response.json() : []);
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

  const totalEvents = analytics?.total_events ?? events.length;

  const sourceCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      const source = event.source || "Unknown";
      counts[source] = (counts[source] || 0) + 1;
      return counts;
    }, {});
  }, [events]);

  const sourceEntries = useMemo(
    () =>
      Object.entries(sourceCounts).sort(([, a], [, b]) => b - a),
    [sourceCounts]
  );

  const maxSourceCount = Math.max(
    ...sourceEntries.map(([, count]) => count),
    1
  );

  const interruptionSourceData = useMemo(
    () =>
      ["Slack", "Jira"].map((source) => ({
        label: source,
        value: contextSwitches.filter(
          (item) => item.to_source === source
        ).length,
      })),
    [contextSwitches]
  );

  const maxInterruptionCount = Math.max(
    ...interruptionSourceData.map((item) => item.value),
    1
  );

  const activityData = useMemo(
    () => [
      {
        label: "Coding",
        value: analytics?.coding_events ?? 0,
      },
      {
        label: "Communication",
        value: analytics?.communication_events ?? 0,
      },
      {
        label: "Productive",
        value: analytics?.productive_events ?? 0,
      },
    ],
    [analytics]
  );

  const healthData = useMemo(
    () => [
      {
        label: "Focus time",
        value: analytics?.focus_time_percent ?? 0,
      },
      {
        label: "Deep work",
        value: analytics?.deep_work_percent ?? 0,
      },
      {
        label: "Communication load",
        value: analytics?.communication_load_percent ?? 0,
      },
    ],
    [analytics]
  );

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

  const formatTime = (timestamp) => {
    if (!timestamp) return "—";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString([], {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getSourceClass = (source) => {
    const value = (source || "").toLowerCase();

    if (value.includes("github")) return "source-github";
    if (value.includes("slack")) return "source-slack";
    if (value.includes("jira")) return "source-jira";
    if (value.includes("ide")) return "source-ide";

    return "source-default";
  };

  const getEventStatus = (event) => {
    if (event.event_type === "commit") return "Productive";

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

  const getStatusClass = (status) => {
    if (status === "Productive") return "status-success";
    if (status === "Focused") return "status-focus";
    if (status === "Interrupting") return "status-warning";
    return "status-neutral";
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

  const chartGeometry = useMemo(() => {
    const width = 900;
    const height = 280;
    const paddingX = 28;
    const paddingY = 24;

    if (!flowPoints.length) {
      return {
        linePath: "",
        areaPath: "",
        points: [],
      };
    }

    const points = flowPoints.map((point, index) => {
      const x =
        flowPoints.length === 1
          ? width / 2
          : paddingX +
            (index / (flowPoints.length - 1)) *
              (width - paddingX * 2);

      const y =
        height -
        paddingY -
        (point.score / 100) * (height - paddingY * 2);

      return {
        ...point,
        x,
        y,
      };
    });

    const linePath = points
      .map(
        (point, index) =>
          `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
      )
      .join(" ");

    const areaPath = `${linePath} L ${
      points[points.length - 1].x
    } ${height - paddingY} L ${points[0].x} ${
      height - paddingY
    } Z`;

    return {
      linePath,
      areaPath,
      points,
    };
  }, [flowPoints]);

  const flowAverage = flowPoints.length
    ? Math.round(
        flowPoints.reduce((sum, point) => sum + point.score, 0) /
          flowPoints.length
      )
    : 0;

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-screen">
          <div className="loading-logo">C</div>
          <div>
            <strong>CogniStream</strong>
            <span>Loading analytics dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <div className="brand-mark">C</div>

            <div>
              <div className="brand-title">CogniStream</div>
              <div className="brand-subtitle">
                Developer Analytics
              </div>
            </div>
          </div>

          <div className="sidebar-section-title">WORKSPACE</div>

          <nav className="sidebar-nav">
            <button className="nav-item active">
              <span className="nav-icon">⌂</span>
              Overview
            </button>

            <button className="nav-item">
              <span className="nav-icon">◌</span>
              Flow State
            </button>

            <button className="nav-item">
              <span className="nav-icon">↔</span>
              Context Switches
            </button>

            <button className="nav-item">
              <span className="nav-icon">▦</span>
              Activity
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-avatar">K</div>

          <div className="user-details">
            <div className="user-name">Developer</div>
            <div className="user-role">Analytics View</div>
          </div>

          <span className="user-menu">•••</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Analytics <span>/</span> <strong>Today</strong>
          </div>

          <div className="topbar-actions">
            <div className="date-chip">
              <span>▣</span>
              {formatDate()}
            </div>

            <div className="live-indicator">
              <span className="live-dot" />
              Live
            </div>
          </div>
        </header>

        <section className="page-header">
          <div>
            <span className="section-label">COGNISTREAM</span>

            <h1>Developer Flow Overview</h1>

            <p>
              Understand focus, interruptions, activity patterns,
              and cognitive load across the current session.
            </p>
          </div>

          <div className="session-summary">
            <span className="session-summary-dot" />
            Session active
          </div>
        </section>

        <section className="metric-grid">
          <div className="metric-card metric-blue">
            <div className="metric-top">
              <div className="metric-icon">◉</div>
              <span className="metric-label">FLOW SCORE</span>
            </div>

            <div className="metric-main">
              <span className="metric-value">
                {analytics?.flow_score ?? 0}
              </span>
              <span className="metric-unit">/100</span>
            </div>

            <div className="metric-bottom">
              <span className="metric-status">{flowStatus}</span>
              <div className="mini-progress">
                <div
                  style={{
                    width: `${analytics?.flow_score ?? 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="metric-card metric-purple">
            <div className="metric-top">
              <div className="metric-icon">◒</div>
              <span className="metric-label">COGNITIVE LOAD</span>
            </div>

            <div className="metric-main">
              <span className="metric-value">
                {analytics?.cognitive_load ?? 0}
              </span>
              <span className="metric-unit">%</span>
            </div>

            <div className="metric-bottom">
              <span className="metric-status">{cognitiveStatus}</span>
              <div className="mini-progress">
                <div
                  style={{
                    width: `${analytics?.cognitive_load ?? 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="metric-card metric-orange">
            <div className="metric-top">
              <div className="metric-icon">↔</div>
              <span className="metric-label">CONTEXT SWITCHES</span>
            </div>

            <div className="metric-main">
              <span className="metric-value">
                {analytics?.context_switches ?? 0}
              </span>
            </div>

            <div className="metric-bottom">
              <span className="metric-status">Detected</span>
              <span className="metric-note">
                source transitions
              </span>
            </div>
          </div>

          <div className="metric-card metric-green">
            <div className="metric-top">
              <div className="metric-icon">✓</div>
              <span className="metric-label">PRODUCTIVE EVENTS</span>
            </div>

            <div className="metric-main">
              <span className="metric-value">
                {analytics?.productive_events ?? 0}
              </span>
            </div>

            <div className="metric-bottom">
              <span className="metric-status">Tracked</span>
              <span className="metric-note">
                {totalEvents} total events
              </span>
            </div>
          </div>

          <div className="metric-card metric-cyan">
            <div className="metric-top">
              <div className="metric-icon">⌁</div>
              <span className="metric-label">TOTAL COMMITS</span>
            </div>

            <div className="metric-main">
              <span className="metric-value">
                {analytics?.total_commits ?? 0}
              </span>
            </div>

            <div className="metric-bottom">
              <span className="metric-status">Tracked</span>
              <span className="metric-note">Git activity</span>
            </div>
          </div>
        </section>

        <section className="card flow-card">
          <div className="card-header flow-header">
            <div>
              <span className="section-label">FLOW STATE</span>
              <h2>Developer Flow Trend</h2>
              <p>
                Event-based flow movement throughout the session
              </p>
            </div>

            <div className="flow-header-stats">
              <div>
                <span>Current</span>
                <strong>
                  {analytics?.flow_score ?? 0}
                </strong>
              </div>

              <div>
                <span>Trend avg.</span>
                <strong>{flowAverage}</strong>
              </div>
            </div>
          </div>

          <div className="chart-area">
            {flowPoints.length > 0 ? (
              <div className="chart-wrapper">
                <div className="chart-y-labels">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>

                <svg
                  className="chart"
                  viewBox="0 0 900 280"
                  preserveAspectRatio="none"
                  aria-label="Developer flow trend"
                >
                  <defs>
                    <linearGradient
                      id="flowAreaGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopOpacity="0.22"
                      />
                      <stop
                        offset="100%"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>

                  {[24, 82, 140, 198, 256].map((y) => (
                    <line
                      key={y}
                      x1="28"
                      y1={y}
                      x2="872"
                      y2={y}
                      className="chart-grid-line"
                    />
                  ))}

                  {chartGeometry.areaPath && (
                    <path
                      d={chartGeometry.areaPath}
                      className="flow-area"
                    />
                  )}

                  {chartGeometry.linePath && (
                    <path
                      d={chartGeometry.linePath}
                      className="flow-line"
                      fill="none"
                    />
                  )}

                  {chartGeometry.points.map((point, index) => (
                    <g key={`${point.time}-${index}`}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="7"
                        className="flow-point-ring"
                      />
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="3.5"
                        className="flow-point"
                      />
                    </g>
                  ))}
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
                      <span
                        key={`${point.time}-label-${index}`}
                      >
                        {point.time}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                No flow data available.
              </div>
            )}
          </div>
        </section>

        <section className="two-column-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">INTERRUPTIONS</span>
                <h2>Interruption Sources</h2>
              </div>

              <span className="card-count">
                {contextSwitches.length} switches
              </span>
            </div>

            {contextSwitches.length > 0 ? (
              <>
                <div className="source-bars">
                  {interruptionSourceData.map((item) => (
                    <div
                      className="source-bar-item"
                      key={item.label}
                    >
                      <div className="source-bar-heading">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>

                      <div className="source-bar-track">
                        <div
                          className={`source-bar-fill ${getSourceClass(
                            item.label
                          )}`}
                          style={{
                            width: `${
                              (item.value /
                                maxInterruptionCount) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="switch-list">
                  {contextSwitches.map(
                    (switchEvent, index) => (
                      <div
                        className="switch-item"
                        key={`${switchEvent.timestamp}-${index}`}
                      >
                        <div className="switch-route">
                          <span>
                            {switchEvent.from_source}
                          </span>
                          <b>→</b>
                          <span
                            className={getSourceClass(
                              switchEvent.to_source
                            )}
                          >
                            {switchEvent.to_source}
                          </span>
                        </div>

                        <div className="switch-meta">
                          <span>
                            {formatTime(
                              switchEvent.timestamp
                            )}
                          </span>
                          <strong>
                            {switchEvent.duration_seconds ??
                              0}
                            s
                          </strong>
                        </div>
                      </div>
                    )
                  )}
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

              <span className="card-count">
                {flowBlocks.length} blocks
              </span>
            </div>

            {flowBlocks.length > 0 ? (
              <div className="flow-block-list">
                {flowBlocks.map((block, index) => (
                  <div
                    className="flow-block-item"
                    key={`${block.start_time}-${index}`}
                  >
                    <div className="flow-block-marker">
                      <span />
                    </div>

                    <div className="flow-block-content">
                      <div className="flow-block-time">
                        {formatTime(block.start_time)}
                        <span>→</span>
                        {formatTime(block.end_time)}
                      </div>

                      <div className="flow-block-duration">
                        <strong>
                          {block.duration_minutes ?? 0}
                        </strong>
                        <span>min uninterrupted</span>
                      </div>
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
        </section>

        <section className="three-column-grid">
          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">ACTIVITY</span>
                <h2>Activity Categories</h2>
              </div>
            </div>

            <div className="activity-bars">
              {activityData.map((item) => {
                const percentage =
                  totalEvents > 0
                    ? Math.round(
                        (item.value / totalEvents) * 100
                      )
                    : 0;

                return (
                  <div
                    className="activity-bar-item"
                    key={item.label}
                  >
                    <div className="activity-heading">
                      <span>{item.label}</span>
                      <strong>
                        {item.value} · {percentage}%
                      </strong>
                    </div>

                    <div className="activity-track">
                      <div
                        className="activity-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="card-footnote">
              Percentage is calculated against total tracked
              events.
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">SOURCES</span>
                <h2>Events by Source</h2>
              </div>
            </div>

            <div className="source-list">
              {sourceEntries.length > 0 ? (
                sourceEntries.map(([source, count]) => (
                  <div className="source-list-item" key={source}>
                    <div className="source-list-top">
                      <div className="source-name-wrapper">
                        <span
                          className={`source-dot ${getSourceClass(
                            source
                          )}`}
                        />
                        <span>{source}</span>
                      </div>

                      <strong>{count}</strong>
                    </div>

                    <div className="source-progress">
                      <div
                        className={`source-progress-fill ${getSourceClass(
                          source
                        )}`}
                        style={{
                          width: `${
                            (count / maxSourceCount) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  No source data available.
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <span className="section-label">SESSION HEALTH</span>
                <h2>Session Health</h2>
              </div>
            </div>

            <div className="health-list">
              {healthData.map((item) => (
                <div className="health-item" key={item.label}>
                  <div className="health-heading">
                    <span>{item.label}</span>
                    <strong>{item.value}%</strong>
                  </div>

                  <div className="health-track">
                    <div
                      className="health-fill"
                      style={{
                        width: `${Math.min(
                          Math.max(item.value, 0),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card recent-events-card">
          <div className="card-header">
            <div>
              <span className="section-label">LIVE ACTIVITY</span>
              <h2>Recent Events</h2>
              <p>
                Latest developer activity captured by the
                analytics pipeline.
              </p>
            </div>

            <div className="event-count">
              {events.length} events
            </div>
          </div>

          <div className="activity-table">
            <div className="activity-table-header">
              <span>TIME</span>
              <span>SOURCE</span>
              <span>EVENT</span>
              <span>STATUS</span>
            </div>

            {events.length > 0 ? (
              [...events]
                .sort(
                  (a, b) =>
                    new Date(b.timestamp) -
                    new Date(a.timestamp)
                )
                .map((event, index) => {
                  const status = getEventStatus(event);

                  return (
                    <div
                      className="activity-table-row"
                      key={`${event.timestamp}-${index}`}
                    >
                      <span className="event-time">
                        {formatTime(event.timestamp)}
                      </span>

                      <span>
                        <span
                          className={`source-pill ${getSourceClass(
                            event.source
                          )}`}
                        >
                          {event.source || "Unknown"}
                        </span>
                      </span>

                      <span className="event-type">
                        {event.event_type || "Activity"}
                      </span>

                      <span>
                        <span
                          className={`status-badge ${getStatusClass(
                            status
                          )}`}
                        >
                          <span className="status-dot" />
                          {status}
                        </span>
                      </span>
                    </div>
                  );
                })
            ) : (
              <div className="empty-state">
                No activity available.
              </div>
            )}
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>CogniStream Developer Analytics</span>
          <span>Analytics pipeline connected</span>
        </footer>
      </main>
    </div>
  );
}

export default App;