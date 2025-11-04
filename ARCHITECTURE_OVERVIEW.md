# AeroTrack AI — System Architecture & Data Flow

A clear, end‑to‑end view of how flight data flows from source, through transformation and machine learning, into user‑facing applications and the conversational agent. The Mermaid diagram below uses color‑coded nodes to separate concerns and make the pipeline easy to digest.

```mermaid
%% ------------------------------------------------------
%% AeroTrack AI Architecture — Color‑coded, end‑to‑end
%% ------------------------------------------------------
graph TD
  %% ====== Data Flow Nodes ======
  API["🛰️ OpenSky Network API"]
  FVT["⚙️ Fivetran Connector\n(fivetran_connector/connector.py)"]
  BQ_RAW["🗄️ BigQuery: live_flights"]
  SQL_T["🔍 SQL: 1_create_training_data.sql"]
  BQ_TRAIN["📊 BigQuery: daily_flight_hours"]
  ML_TRAIN["🤖 ML Model Training"]
  ML_PRED["📈 ML Batch Prediction"]
  BQ_PRED["🧮 BigQuery: predictions_%"]
  SQL_S["🧠 SQL: 2_populate_maintenance_schedule.sql"]
  BQ_FINAL["📅 BigQuery: maintenance_schedules"]
  APP["💻 Next.js Web App (frontend/)"]
  AGENT["🗣️ Gemma 3 4B Conversational Model"]
  USER["👨‍✈️ Logistics Manager"]

  %% ====== Connections ======
  API --> FVT
  FVT --> BQ_RAW
  BQ_RAW --> SQL_T
  SQL_T --> BQ_TRAIN
  BQ_TRAIN --> ML_TRAIN
  ML_TRAIN --> ML_PRED
  BQ_TRAIN --> ML_PRED
  ML_PRED --> BQ_PRED
  BQ_PRED --> SQL_S
  SQL_S --> BQ_FINAL
  BQ_FINAL --> APP
  BQ_FINAL --> AGENT
  BQ_RAW --> AGENT
  AGENT --> USER
  APP --> USER

  %% ====== Visual Grouping (Subgraphs) ======
  subgraph Data Sources
    API
  end

  subgraph ETL / Ingestion
    FVT
  end

  subgraph Warehouse & Analytics
    BQ_RAW
    BQ_TRAIN
    BQ_PRED
    BQ_FINAL
  end

  subgraph Machine Learning
    ML_TRAIN
    ML_PRED
  end

  subgraph Applications
    APP
    AGENT
    USER
  end

  %% ====== Styling (Colors & Emphasis) ======
  classDef api fill:#1e90ff,stroke:#0b61c1,stroke-width:2px,color:#ffffff,font-weight:bold;
  classDef etl fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#1f2937,font-weight:bold;
  classDef warehouse fill:#14b8a6,stroke:#0f766e,stroke-width:2px,color:#072e2c,font-weight:bold;
  classDef analytics fill:#38bdf8,stroke:#0ea5e9,stroke-width:2px,color:#0b1b2b,font-weight:bold;
  classDef sql fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#ffffff,font-weight:bold;
  classDef ml fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#ffffff,font-weight:bold;
  classDef mlPred fill:#fb7185,stroke:#be123c,stroke-width:2px,color:#ffffff,font-weight:bold;
  classDef app fill:#22c55e,stroke:#16a34a,stroke-width:2px,color:#052e16,font-weight:bold;
  classDef agent fill:#6366f1,stroke:#4338ca,stroke-width:2px,color:#ffffff,font-weight:bold;
  classDef user fill:#e5e7eb,stroke:#374151,stroke-width:2px,color:#111827,font-weight:bold;

  class API api;
  class FVT etl;
  class BQ_RAW warehouse;
  class BQ_TRAIN analytics;
  class BQ_PRED analytics;
  class BQ_FINAL warehouse;
  class SQL_T sql;
  class SQL_S sql;
  class ML_TRAIN ml;
  class ML_PRED mlPred;
  class APP app;
  class AGENT agent;
  class USER user;

  %% Edge styles (subtle, readable)
  linkStyle default stroke:#64748b,stroke-width:2px,opacity:0.75;
  linkStyle 14 stroke:#22c55e,stroke-width:3px;  %% APP --> USER
  linkStyle 13 stroke:#6366f1,stroke-width:3px;  %% AGENT --> USER
```

---

## Overview
- Ingests live flight telemetry from the OpenSky Network via a Fivetran connector.
- Curates training signals in BigQuery with SQL, trains a model, and produces batch predictions.
- Populates a scheduling table that powers both the Next.js web app and a Gemma 3 4B agent.
- Serves operations teams with insights and conversational access to the same data.

## Data Flow (Step‑by‑Step)
1. Source: `OpenSky Network API` streams flight data.
2. Ingestion: `Fivetran Connector (fivetran_connector/connector.py)` lands raw telemetry in `BigQuery: live_flights`.
3. Feature Curation: `SQL: 1_create_training_data.sql` aggregates and cleans signals → `BigQuery: daily_flight_hours`.
4. Model Training: `ML Model Training` consumes curated tables; hyperparameters and artifacts tracked externally.
5. Batch Prediction: `ML Batch Prediction` writes scored outputs to partitioned `BigQuery: predictions_%`.
6. Scheduling Logic: `SQL: 2_populate_maintenance_schedule.sql` converts predictions into actionable `maintenance_schedules`.
7. Applications: `Next.js Web App (frontend/)` renders schedules; `Gemma 3 4B` provides conversational access.
8. End Users: Logistics managers consume insights via the app and/or the agent.

## Components
- OpenSky API
  - Live ADS‑B telemetry and flight events.
  - Rate‑limited; use time windows and pagination.
- Fivetran Connector
  - Python entrypoint: `fivetran_connector/connector.py`.
  - Handles incremental extracts and schema evolution.
- BigQuery (Warehouse & Analytics)
  - Raw: `live_flights` for ingestion continuity.
  - Curated: `daily_flight_hours` for ML features.
  - Predictions: `predictions_%` partitioned by run/date.
  - Final: `maintenance_schedules` powering downstream apps.
- SQL Transformations
  - `1_create_training_data.sql`: feature engineering and label building.
  - `2_populate_maintenance_schedule.sql`: decision logic to convert ML scores into maintenance actions.
- ML Pipeline
  - Training: consumes curated tables; logs run metadata, metrics.
  - Batch Prediction: writes scored outputs; ensures idempotency.
- Applications
  - Next.js frontend (`frontend/`): dashboard, schedule views, filters.
  - Conversational Agent: `Gemma 3 4B` grounded on `BQ_FINAL` and selective contextual reads from `BQ_RAW`.

## Operations & Reliability
- Scheduling
  - ETL runs on a cron (or orchestrator) aligned with data freshness.
  - Batch predictions follow feature generation completion to avoid drift.
- Idempotency
  - Use run‑scoped partitions (`predictions_%`) to avoid overwrites.
- Access Control
  - App reads from `maintenance_schedules`; writes restricted.
  - Agent uses read‑only views with audit logging.
- Monitoring
  - Track row counts, null rates, and schema changes per stage.
  - Alert on missing partitions or unusually low ingestion volumes.

## Quick Links (Paths)
- Connector: `fivetran_connector/connector.py`
- SQL (features): `sql/1_create_training_data.sql`
- SQL (schedules): `sql/2_populate_maintenance_schedule.sql`
- Frontend: `frontend/`

> Tip: If rendering Mermaid locally, ensure your Markdown viewer supports Mermaid or use GitHub, Vercel’s MD renderer, or a VS Code extension (Markdown Preview Mermaid Support).