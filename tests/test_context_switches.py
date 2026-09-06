import polars as pl

from analytics.context_switches import detect_context_switches


def test_detects_slack_context_switch():
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
                "timestamp": "2026-08-01 09:45:00",
                "source": "Slack",
                "event_type": "message",
            },
        ]
    ).with_columns(
        pl.col("timestamp").str.to_datetime()
    )

    result = detect_context_switches(df)

    assert result.height == 1
    assert result["from_source"][0] == "VSCode"
    assert result["to_source"][0] == "Slack"


def test_detects_jira_context_switch():
    df = pl.DataFrame(
        [
            {
                "developer_id": "TEST001",
                "timestamp": "2026-08-01 10:00:00",
                "source": "GitHub",
                "event_type": "commit",
            },
            {
                "developer_id": "TEST001",
                "timestamp": "2026-08-01 11:00:00",
                "source": "Jira",
                "event_type": "ticket_update",
            },
        ]
    ).with_columns(
        pl.col("timestamp").str.to_datetime()
    )

    result = detect_context_switches(df)

    assert result.height == 1
    assert result["from_source"][0] == "GitHub"
    assert result["to_source"][0] == "Jira"