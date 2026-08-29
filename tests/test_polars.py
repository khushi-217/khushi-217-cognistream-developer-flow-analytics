import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from ingestion.polars_cleaner import clean_events_with_polars


def test_polars_cleaning():
    df = clean_events_with_polars()

    assert df.height == 5
    assert df.columns == [
        "developer_id",
        "timestamp",
        "source",
        "event_type",
    ]

    assert df["developer_id"].null_count() == 0
    assert df["timestamp"].null_count() == 0
    assert df["source"].null_count() == 0
    assert df["event_type"].null_count() == 0