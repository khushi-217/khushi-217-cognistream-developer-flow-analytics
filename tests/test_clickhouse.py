from ingestion.clickhouse_client import (
    create_events_table,
    get_clickhouse_client,
)


def test_clickhouse_connection():
    client = get_clickhouse_client()

    result = client.query("SELECT 1").result_rows

    assert result == [(1,)]


def test_events_table_exists():
    client = get_clickhouse_client()

    create_events_table(client)

    result = client.query(
        """
        SELECT count()
        FROM system.tables
        WHERE database = 'cognistream'
          AND name = 'developer_events'
        """
    ).result_rows[0][0]

    assert result == 1