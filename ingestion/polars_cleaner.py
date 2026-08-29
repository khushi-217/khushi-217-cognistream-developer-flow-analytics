import json
from pathlib import Path

import polars as pl


INPUT_FILE = (
    Path(__file__).resolve().parent.parent
    / "events_normalized.json"
)

OUTPUT_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "processed"
    / "events_cleaned.parquet"
)


def clean_events_with_polars():
    """Clean and model normalized events using Polars."""

    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        events = json.load(file)

    df = pl.DataFrame(events)

    cleaned_df = (
        df
        .with_columns(
            pl.col("developer_id")
            .cast(pl.String)
            .str.strip_chars(),

            pl.col("timestamp")
            .str.to_datetime(),

            pl.col("source")
            .cast(pl.String)
            .str.strip_chars(),

            pl.col("event_type")
            .cast(pl.String)
            .str.strip_chars()
            .str.to_lowercase(),
        )
        .unique(
            subset=[
                "developer_id",
                "timestamp",
                "source",
                "event_type",
            ]
        )
        .sort(["developer_id", "timestamp"])
    )

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    cleaned_df.write_parquet(OUTPUT_FILE)

    print(f"Cleaned {cleaned_df.height} events.")
    print(f"Output saved to: {OUTPUT_FILE}")

    return cleaned_df


if __name__ == "__main__":
    clean_events_with_polars()