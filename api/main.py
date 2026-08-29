from collections import Counter
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ingestion.clickhouse_client import get_clickhouse_client


app = FastAPI(title="CogniStream API")


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


def fetch_events():
    """Fetch all developer events from ClickHouse."""
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

    return [
        {
            "developer_id": row[0],
            "timestamp": row[1].isoformat(),
            "source": row[2],
            "event_type": row[3],
        }
        for row in result.result_rows
    ]


@app.get("/")
def root():
    return {"message": "CogniStream API is running"}


@app.get("/api/events")
def get_events():
    return fetch_events()


@app.get("/api/analytics/summary")
def get_analytics_summary():
    """Calculate developer productivity metrics from events."""

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

    source_counts = Counter(event["source"] for event in events)

    context_switch_events = {
        "Slack",
        "Jira",
    }

    productive_event_types = {
        "coding",
        "coding_start",
        "commit",
    }

    context_switches = sum(
        1
        for event in events
        if event["source"] in context_switch_events
    )

    coding_events = sum(
        1
        for event in events
        if event["source"] == "VSCode"
    )

    communication_events = source_counts.get("Slack", 0)

    productive_events = sum(
        1
        for event in events
        if event["event_type"] in productive_event_types
    )

    total_events = len(events)

    focus_time_percent = round(
        (coding_events / total_events) * 100
    )

    communication_load_percent = round(
        (communication_events / total_events) * 100
    )

    deep_work_percent = round(
        (productive_events / total_events) * 100
    )

    cognitive_load = min(
        100,
        round((context_switches / total_events) * 100)
    )

    flow_score = max(
        0,
        round(
            (
                focus_time_percent
                + deep_work_percent
                - cognitive_load
            )
            / 2
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


@app.get("/api/analytics/activity")
def get_activity():
    """Return event counts grouped by source."""

    events = fetch_events()

    source_counts = Counter(
        event["source"] for event in events
    )

    return [
        {
            "source": source,
            "count": count,
        }
        for source, count in source_counts.items()
    ]