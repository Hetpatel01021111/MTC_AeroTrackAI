# 🛩️ AeroTrack AI - Predictive Aircraft Maintenance Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/VIDITJAIN7/AeroTrackAI)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.5.0-orange)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

> **Advanced AI-powered flight management and predictive maintenance scheduling platform with conversational AI assistance**

## 🎯 Overview

AeroTrack AI is a comprehensive flight management platform that combines real-time flight data ingestion, machine learning-powered predictive maintenance, and conversational AI to optimize airline operations. The system provides logistics managers with intelligent insights and automated scheduling capabilities for aircraft maintenance.

## 🏗️ System Architecture

### 📋 **Complete System Overview**
AeroTrack AI is a comprehensive flight management platform with integrated machine learning, conversational AI, and automated workflow management across the entire aviation maintenance lifecycle.

```mermaid
%% ===============================================
%% AeroTrack AI - Complete System Architecture
%% Single Unified View of All Components
%% ===============================================
graph TB
    %% ===== DATA SOURCES =====
    API["🛰️ OpenSky Network API<br/>📡 Real-time Flight Data<br/>🔄 Live Telemetry Stream"]
    WEATHER["🌤️ Weather APIs<br/>🌍 Environmental Data<br/>📊 Meteorological Info"]
    MANUAL["👨‍✈️ Manual Input<br/>📝 Maintenance Reports<br/>🔧 Field Data Entry"]
    
    %% ===== ETL & PROCESSING =====
    FVT["🔄 Fivetran Connector<br/>📂 fivetran_connector/connector.py<br/>🚀 Data Pipeline Orchestration"]
    TRANSFORM["🔍 Data Transformation<br/>📊 SQL Processing Layer<br/>🧮 Feature Engineering"]
    N8N["🤖 n8n Workflow Automation<br/>⏰ Scheduled Tasks & Reminders<br/>📧 Email Notifications<br/>🔔 Alert Management"]
    
    %% ===== DATA WAREHOUSE =====
    BQ_RAW["📥 BigQuery: live_flights<br/>🗃️ Raw Telemetry Storage<br/>⚡ Real-time Ingestion"]
    BQ_TRAIN["📊 BigQuery: daily_flight_hours<br/>🎯 Training Dataset<br/>🏪 ML Feature Store"]
    BQ_PRED["🧮 BigQuery: predictions_%<br/>🔮 ML Predictions<br/>📅 Partitioned by Date"]
    BQ_FINAL["📋 BigQuery: maintenance_schedules<br/>✅ Final Schedules<br/>🚀 Production Data"]
    
    %% ===== MACHINE LEARNING =====
    ML_TRAIN["🎓 ML Model Training<br/>🧠 Predictive Algorithms<br/>🔧 Maintenance Forecasting"]
    VERTEX["🌟 Google Vertex AI<br/>🏭 Model Management<br/>🔄 MLOps Pipeline"]
    ML_PRED["📈 ML Batch Prediction<br/>🎯 Automated Scoring<br/>⚠️ Risk Assessment"]
    GEMMA["🤖 Gemma 3 4B Model<br/>💬 Advanced AI Responses<br/>🧠 Context-Aware Chat"]
    
    %% ===== BACKEND SERVICES =====
    FIREBASE_AUTH["🔐 Firebase Authentication<br/>👤 User Management<br/>🔑 Google OAuth Integration"]
    FIRESTORE["🔥 Cloud Firestore<br/>💾 Real-time Database<br/>📊 User Data & Records"]
    FIREBASE_RULES["🛡️ Security Rules<br/>🔒 Data Access Control<br/>👥 User Permissions"]
    DIALOGFLOW["🗣️ Dialogflow CX Agent<br/>💭 Conversational AI<br/>🔤 Natural Language Processing"]
    API_ROUTES["🔌 API Routes Layer<br/>📡 /api/chat<br/>🔧 /api/maintenance<br/>✈️ /api/flights"]
    
    %% ===== FRONTEND =====
    NEXTJS["⚛️ Next.js 15 Frontend<br/>🔥 React 19 Components<br/>📘 TypeScript & Tailwind CSS"]
    DASHBOARD["📊 Analytics Dashboard<br/>📈 Real-time KPIs<br/>📋 System Metrics"]
    MAINTENANCE["🔧 Maintenance Scheduler<br/>✏️ CRUD Operations<br/>📊 Status Management"]
    CHAT["💬 AI Chat Interface<br/>🗨️ Conversational Queries<br/>🎤 Voice & Text Support"]
    FLIGHTS["✈️ Flight Tracker<br/>📡 Real-time Status<br/>🗺️ Route Monitoring"]
    
    %% ===== DEPLOYMENT & USERS =====
    VERCEL["🌐 Vercel Deployment<br/>⚡ Edge Network<br/>📈 Auto Scaling"]
    GCP["☁️ Google Cloud Platform<br/>🏗️ Infrastructure<br/>🔗 Services Integration"]
    LOGISTICS["👨‍✈️ Logistics Manager<br/>🎯 Primary User<br/>👥 Operations Team"]
    TECHNICIAN["🔧 Maintenance Technician<br/>🏭 Field Operations<br/>✅ Task Execution"]
    ADMIN["👑 System Administrator<br/>⚙️ Platform Management<br/>🔧 Configuration"]
    
    %% ===== DATA FLOW CONNECTIONS =====
    API --> FVT
    WEATHER --> FVT
    MANUAL --> FVT
    FVT --> TRANSFORM
    TRANSFORM --> N8N
    TRANSFORM --> BQ_RAW
    N8N --> BQ_RAW
    BQ_RAW --> BQ_TRAIN
    BQ_TRAIN --> ML_TRAIN
    ML_TRAIN --> VERTEX
    VERTEX --> ML_PRED
    ML_PRED --> BQ_PRED
    BQ_PRED --> BQ_FINAL
    BQ_FINAL --> API_ROUTES
    BQ_RAW --> API_ROUTES
    GEMMA --> DIALOGFLOW
    FIREBASE_AUTH --> API_ROUTES
    FIRESTORE --> API_ROUTES
    FIREBASE_RULES --> FIRESTORE
    DIALOGFLOW --> API_ROUTES
    API_ROUTES --> NEXTJS
    FIREBASE_AUTH --> NEXTJS
    NEXTJS --> DASHBOARD
    NEXTJS --> MAINTENANCE
    NEXTJS --> CHAT
    NEXTJS --> FLIGHTS
    NEXTJS --> VERCEL
    FIREBASE_AUTH --> GCP
    FIRESTORE --> GCP
    DIALOGFLOW --> GCP
    VERTEX --> GCP
    N8N --> LOGISTICS
    N8N --> TECHNICIAN
    N8N --> ADMIN
    BQ_FINAL --> N8N
    DASHBOARD --> LOGISTICS
    MAINTENANCE --> LOGISTICS
    MAINTENANCE --> TECHNICIAN
    CHAT --> LOGISTICS
    FLIGHTS --> LOGISTICS
    VERCEL --> LOGISTICS
    VERCEL --> TECHNICIAN
    VERCEL --> ADMIN
    
    %% ===== STYLING WITH PERFECT COLORS =====
    classDef dataSource fill:#E3F2FD,stroke:#1976D2,stroke-width:3px,color:#0D47A1,font-weight:bold
    classDef etl fill:#FFF3E0,stroke:#F57C00,stroke-width:3px,color:#E65100,font-weight:bold
    classDef warehouse fill:#E8F5E8,stroke:#388E3C,stroke-width:3px,color:#1B5E20,font-weight:bold
    classDef ml fill:#FCE4EC,stroke:#C2185B,stroke-width:3px,color:#880E4F,font-weight:bold
    classDef backend fill:#F3E5F5,stroke:#7B1FA2,stroke-width:3px,color:#4A148C,font-weight:bold
    classDef frontend fill:#E1F5FE,stroke:#0277BD,stroke-width:3px,color:#01579B,font-weight:bold
    classDef deployment fill:#FAFAFA,stroke:#616161,stroke-width:3px,color:#212121,font-weight:bold
    classDef automation fill:#FFF8E1,stroke:#FF8F00,stroke-width:3px,color:#FF6F00,font-weight:bold
    classDef user fill:#FFEBEE,stroke:#D32F2F,stroke-width:3px,color:#B71C1C,font-weight:bold
    
    %% Apply Styles to Components
    class API,WEATHER,MANUAL dataSource
    class FVT,TRANSFORM etl
    class N8N automation
    class BQ_RAW,BQ_TRAIN,BQ_PRED,BQ_FINAL warehouse
    class ML_TRAIN,ML_PRED,VERTEX,GEMMA ml
    class FIREBASE_AUTH,FIRESTORE,FIREBASE_RULES,DIALOGFLOW,API_ROUTES backend
    class NEXTJS,DASHBOARD,MAINTENANCE,CHAT,FLIGHTS frontend
    class VERCEL,GCP deployment
    class LOGISTICS,TECHNICIAN,ADMIN user
```

### 🔄 **n8n Workflow Automation Integration**

AeroTrack AI integrates with **n8n** (pronounced "n-eight-n") for powerful workflow automation, scheduled tasks, and intelligent reminder systems that keep your maintenance operations running smoothly.

```mermaid
%% ===============================================
%% n8n Workflow Automation for AeroTrack AI
%% ===============================================
graph LR
    %% n8n Workflow Triggers
    SCHEDULE["⏰ Schedule Trigger<br/>📅 Daily/Weekly/Monthly<br/>🕐 Cron Jobs & Intervals"]
    WEBHOOK["🔗 Webhook Trigger<br/>📡 API Events<br/>⚡ Real-time Alerts"]
    MANUAL_TRIGGER["👆 Manual Trigger<br/>🚀 On-Demand Execution<br/>🚨 Emergency Workflows"]
    
    %% n8n Processing Nodes
    FETCH_DATA["🌐 Fetch Flight Data<br/>🛰️ OpenSky API Call<br/>🌤️ Weather Data Retrieval"]
    BUILD_REPORT["📊 Build HTML Report<br/>📋 Maintenance Summary<br/>📈 Flight Statistics"]
    CONDITION["❓ Condition Check<br/>⚠️ Risk Assessment<br/>🎯 Threshold Validation"]
    
    %% n8n Output Actions
    SEND_EMAIL["📧 Send Gmail<br/>🔔 Maintenance Alerts<br/>📊 Status Updates"]
    SLACK_NOTIFY["💬 Slack Notification<br/>👥 Team Alerts<br/>🚨 Urgent Messages"]
    UPDATE_DB["💾 Update Database<br/>🔥 Firestore Write<br/>📝 Status Changes"]
    
    %% Workflow Connections
    SCHEDULE --> FETCH_DATA
    WEBHOOK --> FETCH_DATA
    MANUAL_TRIGGER --> FETCH_DATA
    
    FETCH_DATA --> BUILD_REPORT
    BUILD_REPORT --> CONDITION
    
    CONDITION -->|🔴 High Risk| SEND_EMAIL
    CONDITION -->|🚨 Critical| SLACK_NOTIFY
    CONDITION -->|📝 Update Required| UPDATE_DB
    
    %% Styling
    classDef trigger fill:#E1F5FE,stroke:#0277BD,stroke-width:3px,color:#01579B,font-weight:bold
    classDef process fill:#F3E5F5,stroke:#7B1FA2,stroke-width:3px,color:#4A148C,font-weight:bold
    classDef output fill:#E8F5E8,stroke:#388E3C,stroke-width:3px,color:#1B5E20,font-weight:bold
    
    class SCHEDULE,WEBHOOK,MANUAL_TRIGGER trigger
    class FETCH_DATA,BUILD_REPORT,CONDITION process
    class SEND_EMAIL,SLACK_NOTIFY,UPDATE_DB output
```

### 🤖 **Automated Workflow Features**

#### ⏰ **Scheduled Reminders & Tasks**
- **Daily Maintenance Reports**: Automated generation and distribution of maintenance summaries
- **Weekly Risk Assessments**: Comprehensive analysis of upcoming maintenance needs
- **Monthly Performance Reviews**: Statistical reports on maintenance efficiency and aircraft uptime
- **Custom Interval Alerts**: Configurable reminders for specific maintenance milestones

#### 🔔 **Intelligent Alert System**
- **Predictive Maintenance Alerts**: Proactive notifications based on ML predictions
- **Threshold-Based Warnings**: Automated alerts when risk scores exceed defined limits
- **Multi-Channel Notifications**: Email, Slack, SMS, and in-app notifications
- **Escalation Workflows**: Automatic escalation to supervisors for critical issues

#### 📊 **Automated Reporting**
- **HTML Email Reports**: Beautiful, responsive maintenance reports with charts and graphs
- **Executive Dashboards**: High-level summaries for management stakeholders
- **Technical Detailed Reports**: Comprehensive data for maintenance technicians
- **Compliance Documentation**: Automated generation of regulatory compliance reports

#### 🔄 **Workflow Examples**

**1. Daily Maintenance Check Workflow:**
```
⏰ 6:00 AM Daily → 🌐 Fetch Latest Flight Data → 📊 Generate Report → 📧 Email to Team
```

**2. High-Risk Alert Workflow:**
```
🔗 Risk Threshold Exceeded → ❓ Validate Conditions → 💬 Slack Alert → 📧 Email Supervisor
```

**3. Weekly Summary Workflow:**
```
⏰ Monday 9:00 AM → 🌐 Collect Week's Data → 📊 Build Summary → 📧 Send to Management
```

---

## 🔍 **Individual Component Architectures**

### 🌐 **1. Data Sources Layer**

```mermaid
graph TB
    subgraph "Data Sources"
        API["🛰️ OpenSky Network API<br/>📡 Real-time Flight Data<br/>🔄 Live ADS-B Telemetry"]
        WEATHER["🌤️ Weather APIs<br/>🌍 Environmental Data<br/>📊 Meteorological Info"]
        MANUAL["👨‍✈️ Manual Input<br/>📝 Maintenance Reports<br/>🔧 Field Data Entry"]
    end
    
    API --> |"Flight Positions<br/>Aircraft Status<br/>Route Information"| OUTPUT1["📊 Flight Data Stream"]
    WEATHER --> |"Weather Conditions<br/>Temperature<br/>Wind Speed"| OUTPUT2["🌡️ Environmental Data"]
    MANUAL --> |"Maintenance Logs<br/>Inspection Reports<br/>Issue Tracking"| OUTPUT3["📋 Manual Records"]
    
    classDef dataSource fill:#E3F2FD,stroke:#1976D2,stroke-width:3px,color:#0D47A1,font-weight:bold
    classDef output fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#4A148C,font-weight:bold
    
    class API,WEATHER,MANUAL dataSource
    class OUTPUT1,OUTPUT2,OUTPUT3 output
```

### ⚙️ **2. ETL & Processing Layer**

```mermaid
graph TB
    subgraph "ETL & Processing"
        FVT["🔄 Fivetran Connector<br/>📂 fivetran_connector/connector.py<br/>🚀 Data Pipeline Orchestration"]
        TRANSFORM["🔍 Data Transformation<br/>📊 SQL Processing Layer<br/>🧮 Feature Engineering"]
        N8N["🤖 n8n Workflow Automation<br/>⏰ Scheduled Tasks & Reminders<br/>📧 Email Notifications"]
    end
    
    INPUT["📥 Raw Data Input"] --> FVT
    FVT --> |"Cleaned Data<br/>Schema Validation<br/>Data Quality Checks"| TRANSFORM
    TRANSFORM --> |"Processed Features<br/>Aggregated Metrics<br/>ML-Ready Data"| OUTPUT1["📊 Processed Data"]
    TRANSFORM --> N8N
    N8N --> |"Automated Alerts<br/>Scheduled Reports<br/>Workflow Triggers"| OUTPUT2["🔔 Notifications"]
    
    classDef etl fill:#FFF3E0,stroke:#F57C00,stroke-width:3px,color:#E65100,font-weight:bold
    classDef automation fill:#FFF8E1,stroke:#FF8F00,stroke-width:3px,color:#FF6F00,font-weight:bold
    classDef input fill:#F5F5F5,stroke:#9E9E9E,stroke-width:2px,color:#424242,font-weight:bold
    classDef output fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#4A148C,font-weight:bold
    
    class FVT,TRANSFORM etl
    class N8N automation
    class INPUT input
    class OUTPUT1,OUTPUT2 output
```

### 🗄️ **3. Data Warehouse Layer**

```mermaid
graph TB
    subgraph "BigQuery Data Warehouse"
        BQ_RAW["📥 live_flights<br/>🗃️ Raw Telemetry Storage<br/>⚡ Real-time Ingestion"]
        BQ_TRAIN["📊 daily_flight_hours<br/>🎯 Training Dataset<br/>🏪 ML Feature Store"]
        BQ_PRED["🧮 predictions_%<br/>🔮 ML Predictions<br/>📅 Partitioned by Date"]
        BQ_FINAL["📋 maintenance_schedules<br/>✅ Final Schedules<br/>🚀 Production Data"]
    end
    
    INPUT["📥 Processed Data"] --> BQ_RAW
    BQ_RAW --> |"Data Aggregation<br/>Feature Engineering<br/>Time Series Analysis"| BQ_TRAIN
    BQ_TRAIN --> |"ML Training Data<br/>Historical Patterns<br/>Feature Vectors"| ML_INPUT["🤖 ML Pipeline"]
    ML_INPUT --> |"Prediction Results<br/>Risk Scores<br/>Maintenance Forecasts"| BQ_PRED
    BQ_PRED --> |"Schedule Generation<br/>Priority Ranking<br/>Resource Allocation"| BQ_FINAL
    BQ_FINAL --> OUTPUT["📊 Production Data"]
    
    classDef warehouse fill:#E8F5E8,stroke:#388E3C,stroke-width:3px,color:#1B5E20,font-weight:bold
    classDef ml fill:#FCE4EC,stroke:#C2185B,stroke-width:2px,color:#880E4F,font-weight:bold
    classDef input fill:#F5F5F5,stroke:#9E9E9E,stroke-width:2px,color:#424242,font-weight:bold
    classDef output fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#4A148C,font-weight:bold
    
    class BQ_RAW,BQ_TRAIN,BQ_PRED,BQ_FINAL warehouse
    class ML_INPUT ml
    class INPUT input
    class OUTPUT output
```

### 🤖 **4. Machine Learning & AI Layer**

```mermaid
graph TB
    subgraph "ML & AI Pipeline"
        ML_TRAIN["🎓 ML Model Training<br/>🧠 Predictive Algorithms<br/>🔧 Maintenance Forecasting"]
        VERTEX["🌟 Google Vertex AI<br/>🏭 Model Management<br/>🔄 MLOps Pipeline"]
        ML_PRED["📈 ML Batch Prediction<br/>🎯 Automated Scoring<br/>⚠️ Risk Assessment"]
        GEMMA["🤖 Gemma 3 4B Model<br/>💬 Advanced AI Responses<br/>🧠 Context-Aware Chat"]
    end
    
    INPUT["📊 Training Data"] --> ML_TRAIN
    ML_TRAIN --> |"Model Artifacts<br/>Training Metrics<br/>Model Validation"| VERTEX
    VERTEX --> |"Deployed Models<br/>Model Versioning<br/>A/B Testing"| ML_PRED
    ML_PRED --> |"Prediction Results<br/>Risk Scores<br/>Confidence Intervals"| OUTPUT1["📈 Predictions"]
    GEMMA --> |"Natural Language<br/>Conversational AI<br/>Context Understanding"| OUTPUT2["💬 AI Responses"]
    
    classDef ml fill:#FCE4EC,stroke:#C2185B,stroke-width:3px,color:#880E4F,font-weight:bold
    classDef input fill:#F5F5F5,stroke:#9E9E9E,stroke-width:2px,color:#424242,font-weight:bold
    classDef output fill:#F3E5F5,stroke:#7B1FA2,stroke-width:2px,color:#4A148C,font-weight:bold
    
    class ML_TRAIN,VERTEX,ML_PRED,GEMMA ml
    class INPUT input
    class OUTPUT1,OUTPUT2 output
```

### 🔧 **5. Backend Services Layer**

```mermaid
graph TB
    subgraph "Backend Services"
        FIREBASE_AUTH["🔐 Firebase Authentication<br/>👤 User Management<br/>🔑 Google OAuth Integration"]
        FIRESTORE["🔥 Cloud Firestore<br/>💾 Real-time Database<br/>📊 User Data & Records"]
        FIREBASE_RULES["🛡️ Security Rules<br/>🔒 Data Access Control<br/>👥 User Permissions"]
        DIALOGFLOW["🗣️ Dialogflow CX Agent<br/>💭 Conversational AI<br/>🔤 Natural Language Processing"]
        API_ROUTES["🔌 API Routes Layer<br/>📡 /api/chat<br/>🔧 /api/maintenance<br/>✈️ /api/flights"]
    end
    
    USER_INPUT["👤 User Requests"] --> FIREBASE_AUTH
    FIREBASE_AUTH --> |"Authentication Tokens<br/>User Validation<br/>Session Management"| API_ROUTES
    API_ROUTES --> |"Data Queries<br/>CRUD Operations<br/>Real-time Updates"| FIRESTORE
    FIREBASE_RULES --> |"Access Control<br/>Data Validation<br/>Security Policies"| FIRESTORE
    API_ROUTES --> |"Chat Queries<br/>Intent Recognition<br/>Context Management"| DIALOGFLOW
    DIALOGFLOW --> |"AI Responses<br/>Intent Results<br/>Conversation Flow"| OUTPUT["📱 Frontend Response"]
    
    classDef backend fill:#F3E5F5,stroke:#7B1FA2,stroke-width:3px,color:#4A148C,font-weight:bold
    classDef input fill:#F5F5F5,stroke:#9E9E9E,stroke-width:2px,color:#424242,font-weight:bold
    classDef output fill:#E1F5FE,stroke:#0277BD,stroke-width:2px,color:#01579B,font-weight:bold
    
    class FIREBASE_AUTH,FIRESTORE,FIREBASE_RULES,DIALOGFLOW,API_ROUTES backend
    class USER_INPUT input
    class OUTPUT output
```

### 💻 **6. Frontend & User Interface Layer**

```mermaid
graph TB
    subgraph "Frontend Application"
        NEXTJS["⚛️ Next.js 15 Frontend<br/>🔥 React 19 Components<br/>📘 TypeScript & Tailwind CSS"]
        DASHBOARD["📊 Analytics Dashboard<br/>📈 Real-time KPIs<br/>📋 System Metrics"]
        MAINTENANCE["🔧 Maintenance Scheduler<br/>✏️ CRUD Operations<br/>📊 Status Management"]
        CHAT["💬 AI Chat Interface<br/>🗨️ Conversational Queries<br/>🎤 Voice & Text Support"]
        FLIGHTS["✈️ Flight Tracker<br/>📡 Real-time Status<br/>🗺️ Route Monitoring"]
    end
    
    API_INPUT["🔌 API Data"] --> NEXTJS
    NEXTJS --> |"Component Rendering<br/>State Management<br/>User Interactions"| DASHBOARD
    NEXTJS --> |"Form Handling<br/>Data Validation<br/>CRUD Operations"| MAINTENANCE
    NEXTJS --> |"Chat Interface<br/>Message Handling<br/>AI Integration"| CHAT
    NEXTJS --> |"Real-time Updates<br/>Flight Visualization<br/>Status Monitoring"| FLIGHTS
    
    DASHBOARD --> OUTPUT1["📊 Analytics View"]
    MAINTENANCE --> OUTPUT2["🔧 Maintenance Interface"]
    CHAT --> OUTPUT3["💬 Chat Experience"]
    FLIGHTS --> OUTPUT4["✈️ Flight Dashboard"]
    
    classDef frontend fill:#E1F5FE,stroke:#0277BD,stroke-width:3px,color:#01579B,font-weight:bold
    classDef input fill:#F5F5F5,stroke:#9E9E9E,stroke-width:2px,color:#424242,font-weight:bold
    classDef output fill:#FFEBEE,stroke:#D32F2F,stroke-width:2px,color:#B71C1C,font-weight:bold
    
    class NEXTJS,DASHBOARD,MAINTENANCE,CHAT,FLIGHTS frontend
    class API_INPUT input
    class OUTPUT1,OUTPUT2,OUTPUT3,OUTPUT4 output
```

### 🚀 **7. Deployment & Users Layer**

```mermaid
graph TB
    subgraph "Deployment Infrastructure"
        VERCEL["🌐 Vercel Deployment<br/>⚡ Edge Network<br/>📈 Auto Scaling"]
        GCP["☁️ Google Cloud Platform<br/>🏗️ Infrastructure<br/>🔗 Services Integration"]
    end
    
    subgraph "End Users"
        LOGISTICS["👨‍✈️ Logistics Manager<br/>🎯 Primary User<br/>👥 Operations Team"]
        TECHNICIAN["🔧 Maintenance Technician<br/>🏭 Field Operations<br/>✅ Task Execution"]
        ADMIN["👑 System Administrator<br/>⚙️ Platform Management<br/>🔧 Configuration"]
    end
    
    APP_INPUT["📱 Application"] --> VERCEL
    SERVICES_INPUT["🔧 Backend Services"] --> GCP
    
    VERCEL --> |"Web Application<br/>Real-time Updates<br/>Responsive Interface"| LOGISTICS
    VERCEL --> |"Mobile Access<br/>Field Operations<br/>Task Management"| TECHNICIAN
    VERCEL --> |"Admin Dashboard<br/>System Configuration<br/>User Management"| ADMIN
    
    GCP --> |"Infrastructure Support<br/>Service Integration<br/>Data Processing"| VERCEL
    
    classDef deployment fill:#FAFAFA,stroke:#616161,stroke-width:3px,color:#212121,font-weight:bold
    classDef user fill:#FFEBEE,stroke:#D32F2F,stroke-width:3px,color:#B71C1C,font-weight:bold
    classDef input fill:#F5F5F5,stroke:#9E9E9E,stroke-width:2px,color:#424242,font-weight:bold
    
    class VERCEL,GCP deployment
    class LOGISTICS,TECHNICIAN,ADMIN user
    class APP_INPUT,SERVICES_INPUT input
```

## 🚀 Features

### ✅ **Complete Feature Set**

- **🔍 Advanced Search & Filtering** - Global search, multi-filters, real-time results
- **☑️ Multi-Select Operations** - Bulk actions, visual feedback, persistent selections  
- **🗑️ Data Management** - Full CRUD operations, real-time sync, audit trails
- **🤖 AI-Powered Chat** - Dialogflow CX + Gemma 3 4B, context-aware conversations
- **🔐 Authentication & Security** - Firebase Auth, Google OAuth, granular access control
- **📊 Analytics & Monitoring** - Real-time dashboards, performance tracking, predictive analytics

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Framer Motion
- **Backend**: Firebase 12.5, Cloud Firestore, BigQuery, Google Cloud Functions
- **AI/ML**: Dialogflow CX, Vertex AI, Gemma 3 4B, BigQuery ML, n8n Automation
- **Infrastructure**: Vercel, Google Cloud Platform, Fivetran, OpenSky Network

## 📁 Project Structure

```
flighttrackerAi/
├── src/app/          # Next.js App Router (API routes, pages, layout)
├── src/components/   # React components (auth, chat, dashboard, maintenance)
├── src/contexts/     # React contexts (auth, chat, maintenance state)
├── src/lib/          # Utilities (firebase, dialogflow, helpers)
├── credentials/      # Service account keys
├── public/           # Static assets
└── config files      # package.json, next.config.ts, tailwind.config.js
```

## 🚀 Quick Start

**Prerequisites**: Node.js 18+, Google Cloud Project, Firebase Project

```bash
# 1. Clone & Install
git clone https://github.com/VIDITJAIN7/AeroTrackAI.git
cd AeroTrackAI/flighttrackerAi
npm install

# 2. Environment Setup
cp env.template .env.local
# Configure Firebase, Dialogflow CX, and Google Cloud credentials

# 3. Run Development Server
npm run dev
```

**Setup Requirements**:
- Firebase: Authentication + Firestore + Security Rules
- Google Cloud: Enable Dialogflow API + Service Account
- Dialogflow CX: Create Agent + Configure Intents

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /maintenance/{maintenanceId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
  }
}
```

### Dialogflow CX Intents
- **Welcome**: "Hello", "Hi" → "Hello! I'm your flight management assistant."
- **Flight Status**: "Status of flight [number]?" → "Let me check that flight for you."
- **Maintenance**: "Show maintenance schedule" → "I'll pull the maintenance information."

## 🚀 Deployment

### Vercel Deployment
1. **Connect**: Import GitHub repo to [Vercel Dashboard](https://vercel.com/dashboard)
2. **Environment Variables**: Add all `.env.local` variables to Vercel settings
3. **Build Settings**: Framework: Next.js, Build: `npm run build`, Output: `.next`
4. **Deploy**: Push to GitHub → Auto-deployment

```bash
# Test locally before deployment
npm run build && npm start
```

## 🧪 Testing

```bash
# Unit Tests
npm run test

# API Testing
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me with flight information?"}'

# Firebase Testing  
curl http://localhost:3000/api/test-firebase
```

## 🔍 Troubleshooting

**Common Issues & Solutions**:
- **Authentication Errors**: Check service account JSON file location
- **Firestore Permission Denied**: Update Firestore security rules  
- **Dialogflow Agent Not Found**: Create and configure Dialogflow CX agent
- **Build Failures**: Run `npm run type-check` and `npm run lint:fix`
- **Environment Variables**: Verify `.env.local` exists and restart server

```bash
# Debug Commands
node --version        # Check Node.js 18+
npm run type-check   # Validate TypeScript
npm run build        # Test build
```

## 📊 Performance Optimization

- **Frontend**: Next.js image optimization, code splitting, static generation, edge functions
- **Database**: Firestore indexes, client-side sorting, pagination, strategic caching
- **AI Integration**: Response caching, batch processing, fallback responses, context management

## 🔐 Security

- **Authentication**: Firebase Auth, JWT tokens, Google OAuth, session management
- **Data Security**: Firestore rules, user isolation, input validation, XSS protection
- **API Security**: Rate limiting, CORS configuration, secure credentials, HTTPS enforcement

## 📈 Monitoring & Analytics

- **Application**: Vercel Analytics, error tracking, performance metrics, user insights
- **Database**: Firestore metrics, query performance, storage monitoring, security events  
- **AI Performance**: Response times, success rates, conversation quality, usage patterns

## 🤝 Contributing

1. Fork → Create branch → Make changes → Test → Commit → Push → Create PR
2. **Standards**: TypeScript, ESLint, Prettier, Conventional Commits
3. **Testing**: Unit, Integration, E2E, Performance tests required

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs) • [Firebase Docs](https://firebase.google.com/docs) • [Dialogflow CX](https://cloud.google.com/dialogflow) • [Vercel Docs](https://vercel.com/docs)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**🛩️ Built with ❤️ for Aviation Excellence**

[🌐 Live Demo](https://aerotrack-ai.vercel.app) • [🐛 Issues](https://github.com/Hetpatel01021111/MTC_AeroTrackAI/issues) • [✨ Features](https://github.com/Hetpatel01021111/MTC_AeroTrackAI/issues)

</div>
