from ingestion.clickhouse_client import (
    create_events_table,
    get_clickhouse_client,
    insert_events,
)
from ingestion.polars_cleaner import clean_events_with_polars


def load_events_to_clickhouse():
    """Clean normalized events with Polars and load only new events into ClickHouse."""

    cleaned_df = clean_events_with_polars()

    events = cleaned_df.to_dicts()

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
            event["timestamp"].strftime("%Y-%m-%dT%H:%M:%S"),
            event["source"],
            event["event_type"],
        )
        not in existing_events
    ]

    insert_events(client, new_events)

    print(f"Total events after Polars cleaning: {len(events)}")
    print(f"New events loaded: {len(new_events)}")


if __name__ == "__main__":
    load_events_to_clickhouse()