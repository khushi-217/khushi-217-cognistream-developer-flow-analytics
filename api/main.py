from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ingestion.clickhouse_client import get_clickhouse_client


app = FastAPI(title="CogniStream API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "CogniStream API is running"}


@app.get("/api/events")
def get_events():
    client = get_clickhouse_client()

    result = client.query(
        """
        SELECT
            developer_id,
            timestamp,
            source,
            event_type
        FROM developer_events
        ORDER BY timestamp
        """
    )

    return [
        {
            "developer_id": row[0],
            "timestamp": row[1].isoformat(),
            "source": row[2],
            "event_type": row[3],
        }
        for row in result.result_rows
    ]