from collections import Counter

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ingestion.clickhouse_client import get_clickhouse_client


# ============================================================
# APP CONFIGURATION
# ============================================================

app = FastAPI(
    title="CogniStream API",
    description="Developer Flow & Cognitive Load Analytics API",
    version="1.0.0",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# CLICKHOUSE DATA ACCESS
# ============================================================

def fetch_events():
    """
    Fetch all developer events from ClickHouse.

    Returns:
        list[dict]: Normalized developer event records.
    """

    client = get_clickhouse_client()

    result = client.query(
        """
        SELECT
            developer_id,
            timestamp,
            source,
            event_type
        FROM developer_events
        ORDER BY timestamp
        """
    )

    events = []

    for row in result.result_rows:
        events.append(
            {
                "developer_id": row[0],
                "timestamp": row[1].isoformat(),
                "source": row[2],
                "event_type": row[3],
            }
        )

    return events


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    """Basic API health check."""

    return {
        "message": "CogniStream API is running",
        "status": "healthy",
    }


# ============================================================
# EVENTS API
# ============================================================

@app.get("/api/events")
def get_events():
    """Return all developer events."""

    return fetch_events()


# ============================================================
# ANALYTICS SUMMARY
# ============================================================

@app.get("/api/analytics/summary")
def get_analytics_summary():
    """
    Calculate developer productivity and cognitive-load metrics.
    """

    events = fetch_events()

    if not events:
        return {
            "total_events": 0,
            "context_switches": 0,
            "coding_events": 0,
            "communication_events": 0,
            "productive_events": 0,
            "flow_score": 0,
            "cognitive_load": 0,
            "focus_time_percent": 0,
            "deep_work_percent": 0,
            "communication_load_percent": 0,
        }

    source_counts = Counter(
        event["source"]
        for event in events
    )

    context_switch_sources = {
        "Slack",
        "Jira",
    }

    productive_event_types = {
        "coding",
        "coding_start",
        "commit",
    }

    total_events = len(events)

    context_switches = sum(
        1
        for event in events
        if event["source"] in context_switch_sources
    )

    coding_events = sum(
        1
        for event in events
        if event["source"] == "VSCode"
    )

    communication_events = sum(
        1
        for event in events
        if event["source"] == "Slack"
    )

    productive_events = sum(
        1
        for event in events
        if event["event_type"] in productive_event_types
    )

    focus_time_percent = round(
        (coding_events / total_events) * 100
    )

    deep_work_percent = round(
        (productive_events / total_events) * 100
    )

    communication_load_percent = round(
        (communication_events / total_events) * 100
    )

    cognitive_load = min(
        100,
        round(
            (context_switches / total_events) * 100
        ),
    )

    flow_score = max(
        0,
        min(
            100,
            round(
                (
                    focus_time_percent
                    + deep_work_percent
                    - cognitive_load
                )
                / 2
            ),
        ),
    )

    return {
        "total_events": total_events,
        "context_switches": context_switches,
        "coding_events": coding_events,
        "communication_events": communication_events,
        "productive_events": productive_events,
        "flow_score": flow_score,
        "cognitive_load": cognitive_load,
        "focus_time_percent": focus_time_percent,
        "deep_work_percent": deep_work_percent,
        "communication_load_percent": communication_load_percent,
    }


# ============================================================
# ACTIVITY DISTRIBUTION
# ============================================================

@app.get("/api/analytics/activity")
def get_activity():
    """Return event counts grouped by source."""

    events = fetch_events()

    source_counts = Counter(
        event["source"]
        for event in events
    )

    return [
        {
            "source": source,
            "count": count,
        }
        for source, count in source_counts.items()
    ]


# ============================================================
# EVENT TYPE DISTRIBUTION
# ============================================================

@app.get("/api/analytics/event-types")
def get_event_types():
    """Return event counts grouped by event type."""

    events = fetch_events()

    event_type_counts = Counter(
        event["event_type"]
        for event in events
    )

    return [
        {
            "event_type": event_type,
            "count": count,
        }
        for event_type, count in event_type_counts.items()
    ]


# ============================================================
# SOURCE SUMMARY
# ============================================================

@app.get("/api/analytics/sources")
def get_source_summary():
    """Return detailed source-level activity statistics."""

    events = fetch_events()

    if not events:
        return []

    source_counts = Counter(
        event["source"]
        for event in events
    )

    total_events = len(events)

    return [
        {
            "source": source,
            "count": count,
            "percentage": round(
                (count / total_events) * 100
            ),
        }
        for source, count in source_counts.items()
    ]


# ============================================================
# RECENT EVENTS
# ============================================================

@app.get("/api/analytics/recent")
def get_recent_events():
    """Return the most recent developer events."""

    events = fetch_events()

    events = sorted(
        events,
        key=lambda event: event["timestamp"],
        reverse=True,
    )

    return events[:10]
