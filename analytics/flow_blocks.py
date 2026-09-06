from datetime import timedelta

import polars as pl


FLOW_BLOCK_MINUTES = 90
INTERRUPTION_SOURCES = {"Slack", "Jira"}


def find_uninterrupted_flow_blocks(df: pl.DataFrame) -> pl.DataFrame:
    """Identify coding periods of at least 90 minutes without interruptions."""

    result_schema = {
        "developer_id": pl.String,
        "start_time": pl.Datetime,
        "end_time": pl.Datetime,
        "duration_minutes": pl.Int64,
    }

    if df.is_empty():
        return pl.DataFrame(schema=result_schema)

    events_df = df.sort(["developer_id", "timestamp"])

    blocks = []

    for developer_id in events_df["developer_id"].unique().to_list():
        developer_events = events_df.filter(
            pl.col("developer_id") == developer_id
        ).sort("timestamp")

        coding_start = None
        previous_coding_time = None

        for event in developer_events.iter_rows(named=True):
            timestamp = event["timestamp"]
            source = event["source"]

            if source == "VSCode":
                if coding_start is None:
                    coding_start = timestamp

                previous_coding_time = timestamp

            elif source in INTERRUPTION_SOURCES:
                if coding_start is not None and previous_coding_time is not None:
                    duration = int(
                        (
                            previous_coding_time - coding_start
                        ).total_seconds()
                        / 60
                    )

                    if duration >= FLOW_BLOCK_MINUTES:
                        blocks.append(
                            {
                                "developer_id": developer_id,
                                "start_time": coding_start,
                                "end_time": previous_coding_time,
                                "duration_minutes": duration,
                            }
                        )

                coding_start = None
                previous_coding_time = None

        if coding_start is not None and previous_coding_time is not None:
            duration = int(
                (
                    previous_coding_time - coding_start
                ).total_seconds()
                / 60
            )

            if duration >= FLOW_BLOCK_MINUTES:
                blocks.append(
                    {
                        "developer_id": developer_id,
                        "start_time": coding_start,
                        "end_time": previous_coding_time,
                        "duration_minutes": duration,
                    }
                )

    return pl.DataFrame(blocks, schema=result_schema)