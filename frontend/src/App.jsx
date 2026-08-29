import { useEffect, useMemo, useState } from "react";
import "./App.css";

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/events")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const sourceCounts = useMemo(() => {
    return events.reduce((counts, event) => {
      counts[event.source] = (counts[event.source] || 0) + 1;
      return counts;
    }, {});
  }, [events]);

  const contextSwitches = events.filter(
    (event) =>
      event.event_type === "message" ||
      event.event_type === "ticket_update"
  ).length;

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

          {loading && <div className="info-box">Loading events...</div>}

          {error && <div className="error-box">{error}</div>}

          {!loading && !error && (
            <>
              <section className="metrics-grid">
                <div className="metric-card">
                  <span>Flow Score</span>
                  <strong>82%</strong>
                  <small className="positive">+8.4% compared with yesterday</small>
                  <b>Excellent</b>
                </div>

                <div className="metric-card">
                  <span>Cognitive Load</span>
                  <strong>34%</strong>
                  <small>Low cognitive pressure detected</small>
                  <b>Healthy</b>
                </div>

                <div className="metric-card">
                  <span>Context Switches</span>
                  <strong>{contextSwitches}</strong>
                  <small>During the current session</small>
                  <b>Low</b>
                </div>

                <div className="metric-card">
                  <span>Productive Time</span>
                  <strong>3h 42m</strong>
                  <small>82% of tracked work session</small>
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

                    <strong>{events.length}</strong>
                  </div>

                  <div className="source-list">
                    {Object.entries(sourceCounts).map(([source, count]) => (
                      <div className="source-row" key={source}>
                        <span>{source}</span>
                        <strong>{count}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="content-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>Events by Source</h3>
                      <p>{events.length} processed</p>
                    </div>
                  </div>

                  <div className="source-cards">
                    {Object.entries(sourceCounts).map(([source, count]) => (
                      <div className="source-card" key={source}>
                        <strong>{count}</strong>
                        <span>{source}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h3>Productivity Indicators</h3>
                      <p>Session Health</p>
                    </div>

                    <b>Healthy</b>
                  </div>

                  <div className="indicator">
                    <span>Focus time</span>
                    <strong>82%</strong>
                  </div>

                  <div className="indicator">
                    <span>Deep work</span>
                    <strong>74%</strong>
                  </div>

                  <div className="indicator">
                    <span>Communication load</span>
                    <strong>31%</strong>
                  </div>

                  <div className="indicator">
                    <span>Cognitive load</span>
                    <strong>34%</strong>
                  </div>
                </div>
              </section>

              <section className="panel events-panel">
                <div className="panel-header">
                  <div>
                    <h3>Live Activity</h3>
                    <p>Recent Developer Events</p>
                  </div>

                  <strong>{events.length} events</strong>
                </div>

                <div className="events-table">
                  <div className="table-header">
                    <span>TIME</span>
                    <span>SOURCE</span>
                    <span>EVENT</span>
                    <span>STATUS</span>
                  </div>

                  {events.map((event) => (
                    <div className="table-row" key={`${event.timestamp}-${event.source}`}>
                      <span>
                        {new Date(event.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })}
                      </span>

                      <span>{event.source}</span>

                      <span>{event.event_type}</span>

                      <span
                        className={
                          event.event_type === "message" ||
                          event.event_type === "ticket_update"
                            ? "context"
                            : "focused"
                        }
                      >
                        {event.event_type === "message" ||
                        event.event_type === "ticket_update"
                          ? "Context switch"
                          : "Focused"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          <footer>
            CogniStream • Developer Flow & Cognitive Load Analytics
            <span>Pipeline: Python → Polars → ClickHouse → FastAPI → React</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;