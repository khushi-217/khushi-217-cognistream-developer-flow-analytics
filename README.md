CogniStream 🚀
🎯 Problem Statement

Developers continuously switch between coding, communication, task management, and version-control activities.

These frequent transitions can interrupt focused work and increase cognitive load.

CogniStream analyzes these activities to identify:

Developer flow-state
Context switching
Coding activity
Productive events
Communication load
Focus time
Deep-work periods
Cognitive load

🏗️ System Architecture

GitHub ─────┐
Slack ──────┤
IDE ────────┼──► Python Extraction
Jira ───────┘          │
                       ▼
                Apache Airflow
                       │
                       ▼
             Unified Event Ingestion
                       │
                       ▼
              Event Normalization
                       │
                       ▼
                Data Validation
                       │
                       ▼
              Polars Processing
                       │
                       ▼
                 ClickHouse
                       │
                       ▼
                   FastAPI
                       │
                       ▼
              React + Tremor.js
                  Dashboard
🛠️ Technology             Stack
Component	             Technology
Data Extraction	        Python
Workflow Orchestration	  Apache Airflow
Data Processing	        Polars
Database	              ClickHouse
Backend API	              FastAPI
Frontend	              React
Visualization	        Tremor.js
Containerization	         Docker
CI/CD	                    GitHub Actions
Version Control	        Git & GitHub


📌 Week 1 – API Ingestion & Pipeline
Completed

Mock developer activity data
GitHub, Slack, IDE and Jira extraction scripts
Apache Airflow ingestion pipeline
Daily ingestion DAG
Unified event ingestion
Event normalization
Data validation
Automated pipeline execution and testing
Airflow DAG
GitHub Extraction ─┐
Slack Extraction ──┤
IDE Extraction ────┼──► Unified Ingestion
Jira Extraction ───┘          │
                              ▼
                     Normalize Events
                              │
                              ▼
                       Validate Data



📊 Week 2 – Data Engineering & Analytics
Completed

ClickHouse database integration
developer_events event table
Polars-based data cleaning and normalization
Processed developer activity data
Duplicate-safe event storage
FastAPI analytics summary endpoint
React dashboard connected with backend API
Data Flow
Raw Events
    │
    ▼
Polars Cleaning
    │
    ▼
Normalized Events
    │
    ▼
ClickHouse
    │
    ▼
FastAPI Analytics
    │
    ▼
React Dashboard

🔄 Week 3 — Advanced Flow Analytics
Focus

Week 3 extends the platform from basic activity metrics toward deeper developer-flow analysis.

Planned / In Progress
Uninterrupted Flow Block detection
Identification of extended coding sessions
Advanced context-switching analysis
Advanced SQL and Polars analytics
Analysis of interruptions and communication events
Context-switching visualizations
Flow-state insights based on developer activity patterns


Target Flow Analysis

Developer Events
       │
       ▼
Time-Ordered Activity
       │
       ▼
Activity Grouping
       │
       ├── Coding
       ├── Communication
       ├── Commits
       └── Other Events
       │
       ▼
Flow Block Detection
       │
       ▼
Context-Switch Analysis
       │
       ▼
Developer Flow Insights

🔄 Week 4 — Final Analytics & Project Polish
Focus

Week 4 focuses on completing the analytics layer, improving the dashboard, validating the complete pipeline, and preparing the project for final presentation.

Planned / In Progress
Final flow-state analytics
Advanced developer productivity insights
Context-switching analysis refinement
Dashboard improvements
Final visualization and UX polish
End-to-end pipeline validation
Final testing
Documentation cleanup
Final project review


Final Project Flow
Data Sources
     │
     ▼
Extraction
     │
     ▼
Airflow
     │
     ▼
Normalization & Validation
     │
     ▼
Polars
     │
     ▼
ClickHouse
     │
     ▼
Advanced Analytics
     │
     ▼
FastAPI
     │
     ▼
React + Tremor Dashboard


📊 Developer Analytics

CogniStream provides analytics such as:
 
Metric	               Description
Flow Score	             Overall developer flow level
Cognitive Load	       Estimated cognitive workload from activity
Context Switches	       Detected transitions between different activity types
Productive Events	       Productive developer actions
Focus Time	             Percentage of focused activity
Deep Work	             Percentage of deeper uninterrupted activity
Communication Load	 Communication-related activity
Activity Distribution	 Activity grouped by source
Events by Source	       GitHub, Slack, IDE, and Jira activity
Session Health	       Overall session condition
Recent Activity	       Latest developer events

🚀 Dashboard

The React + Tremor dashboard provides an interactive overview of developer activity.

Dashboard Components
                 Developer Analytics
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Flow Score      Cognitive Load    Context Switches
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                 Activity Analytics
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
 Activity Distribution  Events by Source  Session Health
                         │
                         ▼
                   Live Activity

Current Dashboard Metrics

The dashboard is connected to the FastAPI backend and displays metrics generated from the processed event data.

🔌 FastAPI Backend

The backend exposes analytics through:

GET /api/analytics/summary

Example response:

{
  "total_events": 5,
  "context_switches": 2,
  "coding_events": 2,
  "communication_events": 1,
  "productive_events": 3,
  "flow_score": 30,
  "cognitive_load": 40,
  "focus_time_percent": 40,
  "deep_work_percent": 60,
  "communication_load_percent": 20
}

🗄️ ClickHouse

ClickHouse is used as the analytical event database.

Main Event Table
cognistream.developer_events

The table stores normalized developer activity including:

Developer ID
Timestamp
Source
Event type
Activity information

Example sources:

VSCode
Slack
GitHub
Jira
🐻 Polars Data Processing

Polars is used to clean, normalize, and transform extracted event data before analytical storage.

Raw JSON Events
       │
       ▼
Polars
       │
       ├── Cleaning
       ├── Normalization
       ├── Transformation
       └── Validation
       │
       ▼
Processed Events
       │
       ▼
ClickHouse

🌬️ Apache Airflow

The main ingestion DAG is:

cognistream_daily_ingestion
DAG Tasks
github_extraction
        │
slack_extraction
        │
ide_extraction
        │
jira_extraction
        │
        ▼
unified_ingestion
        │
        ▼
normalize_events
        │
        ▼
validate_data

Airflow is responsible for orchestrating the daily ingestion and processing workflow.

🐳 Docker

Docker Compose provides reproducible project infrastructure.

Services
Docker Compose
      │
      ├── ClickHouse
      │
      └── Apache Airflow
Start ClickHouse
docker compose up -d clickhouse
Start the complete Docker environment
docker compose up -d


🧪 Testing

The project includes automated tests covering:

Data ingestion
Polars processing
ClickHouse integration

Run tests with:

pytest

The project also verifies the frontend through:

npm run lint
npm run build

⚙️ CI/CD

GitHub Actions is configured to validate both the frontend and Python components.

                    GitHub Actions
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
         Frontend                    Python
             │                         │
        npm ci                    Install deps
             │                         │
          Lint                    ClickHouse
             │                         │
          Build                     pytest
CI Pipeline
Frontend dependency installation
Frontend linting
Frontend production build
Python dependency installation
ClickHouse service startup
Automated pytest execution

📸 Project Evidence

Implementation evidence is maintained in:

screenshots/
└── mid-review/
Mid-Review Evidence
Evidence	File
Airflow successful DAG execution	airflow sucess screenshot.png
Raw event data	raw-events.png
Polars normalized data	polars-normalized.png
ClickHouse developer events	clickhouse-developer-events.png
FastAPI analytics response	fastapi-summary.png
React dashboard	Dashboard.png


📂 Project Structure
CogniStream/
│
├── .github/
│   └── workflows/
│       └── main.yml
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
├── events.json
├── events_normalized.json
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.txt
├── requirements.txt
└── README.md
▶️ How to Run
1. Start ClickHouse
docker compose up -d clickhouse
2. Start FastAPI

From the project root:

uvicorn api.main:app --reload --port 8001
3. Start Frontend
cd frontend
npm install
npm run dev

The frontend can then be accessed through the Vite development server.

📍 Project Status
Component	Status
API Ingestion	✅ Completed
Airflow Pipeline	✅ Completed
Event Normalization	✅ Completed
Data Validation	✅ Completed
Polars Processing	✅ Completed
ClickHouse Storage	✅ Completed
FastAPI Analytics	✅ Completed
React Dashboard	✅ Completed
Docker Infrastructure	✅ Completed
CI/CD	✅ Configured
Advanced Flow Analytics	🔄 In Progress
Context-Switching Analytics	🔄 In Progress
Final Dashboard Polish	⏳ Week 4
Final End-to-End Validation	⏳ Week 4
🎯 Project Goal

CogniStream brings together:

Data Ingestion → Orchestration → Processing → Storage → Analytics → Visualization

to provide a data-driven understanding of developer productivity, flow-state, context switching, and cognitive load.

👩‍💻 Author

Khushi Rawat

B.Tech Computer Science Engineering

GitHub: khushi-217

