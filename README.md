# CogniStream 🚀

### Developer Flow-State & Cognitive Load Analytics

CogniStream is an end-to-end developer analytics platform that analyzes developer activity across coding, communication, task management, and version-control tools to understand **developer flow-state, context switching, productivity patterns, and cognitive load**.

Instead of measuring developer performance only through output such as commits, CogniStream focuses on the **friction experienced during the development process**.

---

## 🎯 Problem Statement

Developers continuously switch between coding, communication, task management, and version-control activities.

Frequent transitions between these activities can interrupt focused work and increase cognitive load.

CogniStream analyzes unified developer activity events to identify:

* Developer flow-state
* Context switching
* Coding activity
* Productive events
* Communication load
* Focus time
* Deep-work periods
* Cognitive load
* Uninterrupted flow blocks
* Activity distribution

---

# 🏗️ System Architecture

```text
Mock Developer Activity APIs
        │
        ├── GitHub
        ├── Slack
        ├── IDE
        └── Jira
        │
        ▼
Python Extraction Layer
        │
        ▼
Apache Airflow
        │
        ▼
Unified Event Ingestion
        │
        ▼
Event Normalization & Validation
        │
        ▼
Polars Data Processing
        │
        ▼
ClickHouse
        │
        ▼
FastAPI Analytics Layer
        │
        ▼
React + Tremor.js Dashboard
```

### End-to-End Data Flow

```text
Data Extraction
      ↓
Orchestration
      ↓
Normalization
      ↓
Validation
      ↓
Polars Processing
      ↓
ClickHouse Storage
      ↓
Analytics
      ↓
FastAPI
      ↓
React Dashboard
```

---

# 🛠️ Technology Stack

| Component              | Technology              |
| ---------------------- | ----------------------- |
| Data Extraction        | Python                  |
| Workflow Orchestration | Apache Airflow          |
| Data Processing        | Polars                  |
| Analytical Database    | ClickHouse              |
| Backend API            | FastAPI                 |
| Frontend               | React                   |
| Visualization          | Tremor.js               |
| Build Tool             | Vite                    |
| Containerization       | Docker / Docker Compose |
| CI/CD                  | GitHub Actions          |
| Version Control        | Git & GitHub            |

---

# 📌 Week 1 — API Ingestion & Pipeline

## Completed

Implemented the initial developer activity ingestion pipeline.

### Data Sources

Mock extraction modules were created for:

* GitHub activity
* Slack activity
* IDE activity
* Jira activity

### Pipeline Components

* Python extraction scripts
* Mock developer activity data
* Apache Airflow ingestion pipeline
* Daily ingestion DAG
* Unified event ingestion
* Event normalization
* Data validation
* Automated pipeline execution
* Automated testing

### Airflow DAG

The primary ingestion workflow is:

```text
cognistream_daily_ingestion
```

Main workflow:

```text
GitHub Extraction ─┐
Slack Extraction ──┤
IDE Extraction ────┤
Jira Extraction ───┘
        ↓
Unified Ingestion
        ↓
Normalize Events
        ↓
Validate Data
```

---

# 📊 Week 2 — Data Modeling & Base Analytics

## ClickHouse

ClickHouse was deployed as the analytical event database.

### Main Event Table

```text
cognistream.developer_events
```

The table stores normalized developer activity including:

* Developer ID
* Timestamp
* Source
* Event type
* Activity information

### Example Sources

```text
VSCode
Slack
GitHub
Jira
```

ClickHouse provides the analytical storage layer for time-oriented developer event analysis.

---

# 🧹 Polars Data Processing

Polars is used to clean, normalize, transform, deduplicate, and prepare developer activity events before analytical storage.

### Processing Flow

```text
Raw JSON Events
      ↓
     Polars
      ↓
 ┌───────────────┐
 │ Cleaning      │
 │ Normalization │
 │ Transformation│
 │ Deduplication │
 │ Validation    │
 └───────────────┘
      ↓
Processed Events
      ↓
ClickHouse
```

The processing pipeline converts raw extracted events into a consistent analytical structure.

---

# 📈 Base Dashboard Metrics

The initial dashboard provides analytics such as:

* Total Events
* Context Switches
* Coding Events
* Communication Events
* Productive Events
* Flow Score
* Cognitive Load
* Focus Time
* Deep Work
* Communication Load

The React dashboard consumes analytical data through the FastAPI backend.

---

# 🔍 Mid-Project Review

The mid-project implementation was validated through:

* Successful Airflow DAG execution
* ClickHouse event storage
* Polars processing
* FastAPI analytics response
* React dashboard rendering
* Tremor.js dashboard components

Implementation evidence is maintained in:

```text
screenshots/
└── mid-review/
```

Available evidence includes:

| Evidence                         | File                              |
| -------------------------------- | --------------------------------- |
| Airflow successful DAG execution | `airflow sucess screenshot.png`   |
| Raw event data                   | `raw-events.png`                  |
| Polars normalized data           | `polars-normalized.png`           |
| ClickHouse developer events      | `clickhouse-developer-events.png` |
| FastAPI analytics response       | `fastapi-summary.png`             |
| React dashboard                  | `Dashboard.png`                   |

---

# 🧠 Week 3 — Advanced Flow Analytics

## Uninterrupted Flow Blocks

CogniStream identifies uninterrupted coding periods of **90 minutes or more** without interruption from communication/task-management sources such as Slack or Jira.

This provides a more meaningful view of deep-work periods than simply counting coding events.

### Example Logic

```text
VSCode
  ↓
Coding
  ↓
Coding
  ↓
Coding
  ↓
90+ Minutes Without Slack/Jira
  ↓
Uninterrupted Flow Block
```

A dedicated analytics module was implemented:

```text
analytics/flow_blocks.py
```

Dedicated tests verify:

* Detection of a 90-minute flow block
* Slack interruption correctly breaking a flow block

---

# 🔄 Context-Switching Analytics

CogniStream detects transitions between developer activities caused by interruptions such as Slack and Jira events.

Implemented analytics module:

```text
analytics/context_switches.py
```

The analytics captures:

* Developer ID
* Switch timestamp
* Previous activity source
* Interruption source

### Example

```text
VSCode → Slack
```

or

```text
GitHub → Jira
```

This helps identify when developers leave their current working context.

Dedicated tests validate context-switch detection.

---

# 📊 Context-Switching Dashboard

The dashboard includes a dedicated **Context Switching** visualization showing:

* Total context switches
* Switch timestamps
* Previous source
* Interruption source

This converts raw activity transitions into an interpretable developer-friction signal.

---

# ⚡ Week 4 — FastAPI Analytics Layer

FastAPI provides the backend analytics layer between ClickHouse and the React frontend.

### API Endpoints

```text
GET /api/events

GET /api/analytics/summary

GET /api/analytics/activity

GET /api/analytics/event-types

GET /api/analytics/sources

GET /api/analytics/recent

GET /api/analytics/context-switches

GET /api/analytics/flow-blocks
```

The API reads analytical event data and exposes structured results to the frontend.

---

# 📊 Current Dashboard

The final dashboard brings together developer productivity and developer-friction analytics.

### Core Metrics

* Flow Score
* Cognitive Load
* Context Switches
* Productive Events

### Activity Analytics

* Activity Distribution
* Events by Source
* Coding activity
* Communication activity

### Session Analytics

* Session Health
* Focus Time
* Deep Work
* Communication Load
* Cognitive Load

### Advanced Analytics

* Context Switching
* Uninterrupted Flow Blocks
* Recent Activity
* Live Activity

---

# 🔗 Backend → Frontend Integration

The final architecture connects the frontend directly to the FastAPI analytics layer.

```text
ClickHouse
     ↓
FastAPI
     ↓
React
     ↓
Tremor.js
     ↓
Analytics Dashboard
```

The frontend validates API responses before rendering analytics data and handles empty states for analytics that do not have matching events.

---

# 🐳 Docker Infrastructure

Docker Compose provides reproducible infrastructure for the project.

### Main Services

```text
Docker Compose
     │
     ├── ClickHouse
     │
     └── Apache Airflow
```

### Start ClickHouse

```bash
docker compose up -d clickhouse
```

### Start the complete Docker environment

```bash
docker compose up -d
```

---

# 🧪 Testing & Validation

The project includes automated tests covering core data-engineering functionality.

### Test Coverage

* Data ingestion
* Polars processing
* ClickHouse integration
* Uninterrupted Flow Block analytics
* Context-Switching analytics

Run the Python test suite:

```bash
pytest
```

Frontend validation:

```bash
npm run lint
npm run build
```

The final Week 4 implementation was validated with the complete test suite and a successful production frontend build.

---

# ⚙️ CI/CD

GitHub Actions is configured to validate the Python and frontend components.

### CI Pipeline

```text
GitHub Actions
      │
      ├── Frontend
      │     ├── npm ci
      │     ├── Lint
      │     └── Build
      │
      └── Python
            ├── Install dependencies
            ├── Start ClickHouse
            └── pytest
```

The CI workflow validates the project automatically during repository changes.

---

# 📁 Project Structure
```text


CogniStream/
│
├── .github/
│   └── workflows/
│       └── main.yml
│
├── analytics/
│   ├── context_switches.py
│   └── flow_blocks.py
│
├── api/
│   └── main.py
│
├── dags/
│   └── cognistream_ingestion_dag.py
│
├── ingestion/
│   ├── __init__.py
│   ├── clickhouse_client.py
│   ├── load_to_clickhouse.py
│   └── polars_cleaner.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── tests/
│   ├── test_clickhouse.py
│   └── test_polars.py
│
├── github_api.py
├── slack_api.py
├── ide_activity.py
├── event_ingestion.py
├── test_ingestion.py
├── jira_api.py
├── normalize_events.py
├── validate_data.py
│
├── events.json
├── events_normalized.json
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
└── README.md



---

# ▶️ How to Run

## 1. Start ClickHouse

From the project root:

```bash
docker compose up -d clickhouse
```

## 2. Start FastAPI

From the project root:

```bash
uvicorn api.main:app --reload --port 8001
```

The backend will be available on:

```text
http://127.0.0.1:8001
```

## 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend can then be accessed through the Vite development server.

---

# 📌 Final Project Status

| Component                        | Status       |
| -------------------------------- | ------------ |
| API Ingestion                    | ✅ Completed  |
| Airflow Pipeline                 | ✅ Completed  |
| Event Normalization              | ✅ Completed  |
| Data Validation                  | ✅ Completed  |
| Polars Processing                | ✅ Completed  |
| ClickHouse Storage               | ✅ Completed  |
| FastAPI Analytics                | ✅ Completed  |
| React Dashboard                  | ✅ Completed  |
| Tremor.js Visualization          | ✅ Completed  |
| Docker Infrastructure            | ✅ Completed  |
| CI/CD                            | ✅ Configured |
| Uninterrupted Flow Analytics     | ✅ Completed  |
| Context-Switching Analytics      | ✅ Completed  |
| Context-Switching Visualization  | ✅ Completed  |
| Flow Block Dashboard Integration | ✅ Completed  |
| Final Dashboard Polish           | ✅ Completed  |
| Final End-to-End Validation      | ✅ Completed  |

---

# 🎯 Final Project Outcome

CogniStream successfully combines:

```text
Data Ingestion
      ↓
Orchestration
      ↓
Processing
      ↓
Storage
      ↓
Analytics
      ↓
API Layer
      ↓
Visualization
```

The resulting platform provides a unified view of developer activity while focusing on **developer friction, flow-state, context switching, deep-work periods, and cognitive load** rather than measuring productivity only through output.

### Final Architecture

```text
GitHub ──────┐
Slack ───────┤
IDE ─────────┤
Jira ────────┘
      ↓
   Python
      ↓
 Apache Airflow
      ↓
    Polars
      ↓
  ClickHouse
      ↓
   FastAPI
      ↓
React + Tremor.js
      ↓
CogniStream Analytics Dashboard
```

---

# 👩‍💻 Author

**Khushi Rawat**

B.Tech Computer Science Engineering

GitHub: `khushi-217`
