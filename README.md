CogniStream 🚀

Developer Flow-State & Cognitive Load Analytics Platform

CogniStream is a developer analytics platform designed to collect, normalize, process, and analyze developer activity from multiple sources such as GitHub, Jira, Slack, and IDEs.

The platform aims to transform raw developer activity into meaningful insights related to developer flow state, productivity patterns, activity trends, and cognitive load.

---

🎯 Project Overview

CogniStream collects developer event data from multiple development tools and processes it through a unified data ingestion pipeline.

Supported Sources

- 🐙 GitHub
- 📋 Jira
- 💬 Slack
- 💻 IDEs

The collected events are extracted using Python, orchestrated through Apache Airflow, normalized into a unified event format, validated, and prepared for downstream analytics.

---

🏗️ System Architecture

GitHub ─────┐
Jira ───────┤
Slack ──────┼──→ Python Extraction Scripts
IDE ────────┘
                    ↓
              Apache Airflow
                    ↓
             Unified Ingestion
                    ↓
             Event Normalization
                    ↓
              Data Validation
                    ↓
        Analytics / Data Processing
                    ↓
              ClickHouse
                    ↓
          React + Tremor.js Dashboard

---

🛠️ Technology Stack

Component| Technology
Data Extraction| Python
Data Processing| Python, Polars
Workflow Orchestration| Apache Airflow
Analytics Database| ClickHouse
Frontend| React
Dashboard| Tremor.js
Version Control| Git / GitHub

---

📅 Week 1 – API Ingestion

Completed Work

During Week 1, the initial API ingestion pipeline was implemented and validated.

1. Repository & Project Setup

- Created the CogniStream GitHub repository.
- Created the initial project structure.
- Established the Git workflow for development and collaboration.

2. Mock Developer Event Data

Created mock event data representing activity from:

- GitHub
- Slack
- IDE

This data was used to test the ingestion and normalization pipeline before connecting to live data sources.

3. Python Extraction Scripts

Developed Python extraction scripts responsible for collecting source-specific developer events.

The extraction layer is designed to provide a consistent input to the centralized ingestion workflow.

4. Apache Airflow DAG

Created an Apache Airflow DAG to orchestrate the ingestion workflow.

The DAG manages the sequence of:

1. Event extraction
2. Unified ingestion
3. Event normalization
4. Data validation

The DAG was also configured for daily automated execution.

5. Event Normalization

Implemented and tested the normalization process to convert source-specific events into a unified developer-event structure.

This allows events from different platforms to be processed consistently.

6. Data Validation

Added validation checks to verify that the ingested developer events are processed correctly and meet the expected structure.

---

🔄 Ingestion Workflow

GitHub / Slack / IDE / Jira
            ↓
Python Extraction Scripts
            ↓
      Apache Airflow DAG
            ↓
      Unified Ingestion
            ↓
    Event Normalization
            ↓
      Data Validation

---

✅ Week 1 Validation

The Week 1 ingestion pipeline was successfully tested through Apache Airflow.

Validation Results

- ✅ Airflow DAG execution verified.
- ✅ Airflow task logs reviewed.
- ✅ Extraction tasks executed successfully.
- ✅ Slack extraction completed with return code 0.
- ✅ Event normalization processed the available developer events.
- ✅ Data validation workflow verified.
- ✅ Project Git working tree verified clean.
- ✅ Final commit verified on "origin/main".
- ✅ Final commit verified on "collab/main".

---

📊 Current Status

Week 1 — API Ingestion

Status: ✅ Completed

The initial ingestion pipeline has been implemented, orchestrated through Airflow, and validated successfully.

The project is now ready for the next stage of development involving expanded data processing, analytics, storage, and dashboard capabilities.

---

📁 Project Structure

CogniStream/
│
├── airflow/
│   └── dags/
│
├── extraction/
│   ├── github/
│   ├── slack/
│   ├── ide/
│   └── jira/
│
├── data/
│   └── mock/
│
├── processing/
│
├── dashboard/
│
├── tests/
│
├── README.md
└── requirements.txt

---

🔮 Roadmap

- [x] Project repository setup
- [x] Mock developer event generation
- [x] Python extraction scripts
- [x] Apache Airflow ingestion DAG
- [x] Daily DAG scheduling
- [x] Event normalization
- [x] Data validation
- [x] Week 1 pipeline validation
- [ ] Expand source integrations
- [ ] Implement Polars-based data processing
- [ ] Store processed events in ClickHouse
- [ ] Develop analytics layer
- [ ] Build React dashboard
- [ ] Add Tremor.js visualizations
- [ ] Develop developer flow-state insights
- [ ] Develop cognitive-load analytics

---

📌 Project Goal

CogniStream aims to provide developers and engineering teams with actionable insights into development workflows by combining activity data from the tools developers use every day.

The long-term goal is to move beyond simple activity metrics and provide meaningful analytics around flow state, cognitive load, development patterns, and engineering productivity.