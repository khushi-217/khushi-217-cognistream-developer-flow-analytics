import os
from datetime import datetime

import clickhouse_connect


CLICKHOUSE_HOST = os.getenv("CLICKHOUSE_HOST", "localhost")
CLICKHOUSE_PORT = int(os.getenv("CLICKHOUSE_PORT", "8123"))
CLICKHOUSE_USER = os.getenv("CLICKHOUSE_USER", "cognistream")
CLICKHOUSE_PASSWORD = os.getenv("CLICKHOUSE_PASSWORD", "cognistream_dev")
CLICKHOUSE_DATABASE = os.getenv("CLICKHOUSE_DB", "cognistream")


def get_clickhouse_client():
    """Create and return a ClickHouse client."""
    return clickhouse_connect.get_client(
        host=CLICKHOUSE_HOST,
        port=CLICKHOUSE_PORT,
        username=CLICKHOUSE_USER,
        password=CLICKHOUSE_PASSWORD,
        database=CLICKHOUSE_DATABASE,
    )


def create_events_table(client):
    """Create the developer events table if it does not exist."""
    client.command(
        """
        CREATE TABLE IF NOT EXISTS developer_events
        (
            developer_id String,
            timestamp DateTime,
            source LowCardinality(String),
            event_type LowCardinality(String)
        )
        ENGINE = MergeTree
        ORDER BY (developer_id, timestamp)
        """
    )


def insert_events(client, events):
    """Insert normalized events into ClickHouse."""

    rows = [
        [
            event["developer_id"],
            datetime.fromisoformat(
                event["timestamp"].replace("Z", "")
            ),
            event["source"],
            event["event_type"],
        ]
        for event in events
    ]

    if rows:
        client.insert(
            "developer_events",
            rows,
            column_names=[
                "developer_id",
                "timestamp",
                "source",
                "event_type",
            ],
        )