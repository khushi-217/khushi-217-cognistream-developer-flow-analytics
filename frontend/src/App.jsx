import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [eventsResponse, analyticsResponse] = await Promise.all([
          fetch("http://localhost:8000/api/events"),
          fetch("http://localhost:8000/api/analytics/summary"),
        ]);

        if (!eventsResponse.ok || !analyticsResponse.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const eventsData = await eventsResponse.json();
        const analyticsData = await analyticsResponse.json();

        setEvents(eventsData);
        setAnalytics(analyticsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const sourceCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      counts[event.source] = (counts[event.source] || 0) + 1;
      return counts;
    }, {});
  }, [events]);

  const getFlowStatus = (value) => {
    if (value >= 70) return "Excellent";
    if (value >= 50) return "Good";
    return "Needs attention";
  };

  const getCognitiveStatus = (value) => {
    if (value <= 40) return "Healthy";
    if (value <= 60) return "Moderate";
    return "High";
  };

  const isContextSwitch = (event) => {
    return (
      event.event_type === "message" ||
      event.event_type === "ticket_update"
    );
  };

  return (
    <div className="app">
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
            <div className="avatar">K</div>

            <div>
              <strong>DEV001</strong>
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
                  </div>

                  <div className="source-list">
                    {Object.entries(sourceCounts).map(
                      ([source, count]) => (
                        <div
                          className="source-row"
                          key={source}
                        >
                          <span>{source}</span>
                          <strong>{count}</strong>
                        </div>
                      )
                    )}
                  </div>
                </div>
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
                    <strong>
                      {analytics.focus_time_percent}%
                    </strong>
                  </div>

                  <div className="indicator">
                    <span>Deep work</span>
                    <strong>
                      {analytics.deep_work_percent}%
                    </strong>
                  </div>

                  <div className="indicator">
                    <span>Communication load</span>
                    <strong>
                      {analytics.communication_load_percent}%
                    </strong>
                  </div>

                  <div className="indicator">
                    <span>Cognitive load</span>
                    <strong>
                      {analytics.cognitive_load}%
                    </strong>
                  </div>
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
    </div>
  );
}

export default App;