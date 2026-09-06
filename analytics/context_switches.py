import polars as pl


INTERRUPTION_SOURCES = {"Slack", "Jira"}


def detect_context_switches(df: pl.DataFrame) -> pl.DataFrame:
    """Detect context switches caused by Slack or Jira interruptions."""

    result_schema = {
        "developer_id": pl.String,
        "timestamp": pl.Datetime,
        "from_source": pl.String,
        "to_source": pl.String,
    }

    if df.is_empty():
        return pl.DataFrame(schema=result_schema)

    events_df = df.sort(["developer_id", "timestamp"])

    switches = []

    for developer_id in events_df["developer_id"].unique().to_list():
        developer_events = events_df.filter(
            pl.col("developer_id") == developer_id
        ).sort("timestamp")

        previous_source = None

        for event in developer_events.iter_rows(named=True):
            source = event["source"]
            timestamp = event["timestamp"]

            if (
                previous_source is not None
                and source in INTERRUPTION_SOURCES
                and previous_source != source
            ):
                switches.append(
                    {
                        "developer_id": developer_id,
                        "timestamp": timestamp,
                        "from_source": previous_source,
                        "to_source": source,
                    }
                )

            previous_source = source

    return pl.DataFrame(switches, schema=result_schema)