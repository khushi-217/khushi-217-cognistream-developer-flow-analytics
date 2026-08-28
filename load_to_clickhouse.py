import json
from pathlib import Path

from ingestion.clickhouse_client import (
    create_events_table,
    get_clickhouse_client,
    insert_events,
)


INPUT_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "processed"
    / "events_normalized.json"
)


def load_events_to_clickhouse():
    """Load only new normalized events into ClickHouse."""

    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        events = json.load(file)

    client = get_clickhouse_client()

    create_events_table(client)

    existing_rows = client.query(
        """
        SELECT developer_id, timestamp, source, event_type
        FROM developer_events
        """
    ).result_rows

    existing_events = {
        (
            developer_id,
            timestamp.strftime("%Y-%m-%dT%H:%M:%S"),
            source,
            event_type,
        )
        for developer_id, timestamp, source, event_type in existing_rows
    }

    new_events = [
        event
        for event in events
        if (
            event["developer_id"],
            event["timestamp"].replace("Z", ""),
            event["source"],
            event["event_type"],
        )
        not in existing_events
    ]

    insert_events(client, new_events)

    print(f"Total events in file: {len(events)}")
    print(f"New events loaded: {len(new_events)}")


if __name__ == "__main__":
    load_events_to_clickhouse()