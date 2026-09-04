import polars as pl

from analytics.flow_blocks import find_uninterrupted_flow_blocks


def test_detects_90_minute_flow_block():
    df = pl.DataFrame(
        [
            {
                "developer_id": "TEST001",
                "timestamp": "2026-08-01 09:00:00",
                "source": "VSCode",
                "event_type": "coding_start",
            },
            {
                "developer_id": "TEST001",
                "timestamp": "2026-08-01 10:30:00",
                "source": "VSCode",
                "event_type": "coding",
            },
        ]
    ).with_columns(
        pl.col("timestamp").str.to_datetime()
    )

    result = find_uninterrupted_flow_blocks(df)

    assert result.height == 1
    assert result["duration_minutes"][0] == 90


def test_slack_interrupts_flow_block():
    df = pl.DataFrame(
        [
            {
                "developer_id": "TEST001",
                "timestamp": "2026-08-01 09:00:00",
                "source": "VSCode",
                "event_type": "coding_start",
            },
            {
                "developer_id": "TEST001",
                "timestamp": "2026-08-01 10:00:00",
                "source": "Slack",
                "event_type": "message",
            },
            {
                "developer_id": "TEST001",
                "timestamp": "2026-08-01 11:30:00",
                "source": "VSCode",
                "event_type": "coding",
            },
        ]
    ).with_columns(
        pl.col("timestamp").str.to_datetime()
    )

    result = find_uninterrupted_flow_blocks(df)

    assert result.height == 0