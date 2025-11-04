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

```mermaid
%% ===============================================
%% AeroTrack AI - Complete System Architecture
%% ===============================================
graph TD
    %% ===== DATA SOURCES =====
    API["🛰️ OpenSky Network API<br/>Real-time Flight Data"]
    WEATHER["🌤️ Weather APIs<br/>Environmental Data"]
    MANUAL["👨‍✈️ Manual Input<br/>Maintenance Reports"]
    
    %% ===== ETL & INGESTION =====
    FVT["⚙️ Fivetran Connector<br/>fivetran_connector/connector.py<br/>Data Pipeline Orchestration"]
    TRANSFORM["🔄 Data Transformation<br/>SQL Processing Layer<br/>Feature Engineering"]
    
    %% ===== DATA WAREHOUSE =====
    BQ_RAW["🗄️ BigQuery: live_flights<br/>Raw Telemetry Storage<br/>Real-time Ingestion"]
    BQ_TRAIN["📊 BigQuery: daily_flight_hours<br/>Training Dataset<br/>ML Feature Store"]
    BQ_PRED["🧮 BigQuery: predictions_%<br/>ML Predictions<br/>Partitioned by Date"]
    BQ_FINAL["📅 BigQuery: maintenance_schedules<br/>Final Schedules<br/>Production Data"]
    
    %% ===== MACHINE LEARNING =====
    ML_TRAIN["🤖 ML Model Training<br/>Predictive Algorithms<br/>Maintenance Forecasting"]
    ML_PRED["📈 ML Batch Prediction<br/>Automated Scoring<br/>Risk Assessment"]
    VERTEX["🧠 Google Vertex AI<br/>Model Management<br/>MLOps Pipeline"]
    
    %% ===== BACKEND SERVICES =====
    FIREBASE_AUTH["🔐 Firebase Authentication<br/>User Management<br/>Google OAuth Integration"]
    FIRESTORE["🔥 Cloud Firestore<br/>Real-time Database<br/>User Data & Maintenance Records"]
    FIREBASE_RULES["🛡️ Security Rules<br/>Data Access Control<br/>User Permissions"]
    
    %% ===== AI & CONVERSATIONAL =====
    DIALOGFLOW["🗣️ Dialogflow CX Agent<br/>Conversational AI<br/>Natural Language Processing"]
    GEMMA["🤖 Gemma 3 4B Model<br/>Advanced AI Responses<br/>Context-Aware Chat"]
    
    %% ===== FRONTEND APPLICATION =====
    NEXTJS["💻 Next.js 15 Frontend<br/>React 19 Components<br/>TypeScript & Tailwind CSS"]
    
    %% ===== USER INTERFACES =====
    DASHBOARD["📊 Dashboard<br/>Analytics & KPIs<br/>Real-time Metrics"]
    MAINTENANCE["🔧 Maintenance Scheduler<br/>CRUD Operations<br/>Status Management"]
    CHAT["💬 AI Chat Interface<br/>Conversational Queries<br/>Voice & Text Support"]
    FLIGHTS["✈️ Flight Tracker<br/>Real-time Status<br/>Route Monitoring"]
    
    %% ===== USERS =====
    LOGISTICS["👨‍✈️ Logistics Manager<br/>Primary User<br/>Operations Team"]
    TECHNICIAN["🔧 Maintenance Technician<br/>Field Operations<br/>Task Execution"]
    ADMIN["👑 System Administrator<br/>Platform Management<br/>Configuration"]
    
    %% ===== DEPLOYMENT & INFRASTRUCTURE =====
    VERCEL["🚀 Vercel Deployment<br/>Edge Network<br/>Auto Scaling"]
    GCP["☁️ Google Cloud Platform<br/>Infrastructure<br/>Services Integration"]
    
    %% ===== API LAYER =====
    API_ROUTES["🔌 API Routes<br/>/api/chat<br/>/api/maintenance<br/>/api/flights"]
    
    %% ===== CONNECTIONS =====
    %% Data Flow
    API --> FVT
    WEATHER --> FVT
    MANUAL --> FVT
    FVT --> TRANSFORM
    TRANSFORM --> BQ_RAW
    BQ_RAW --> BQ_TRAIN
    BQ_TRAIN --> ML_TRAIN
    ML_TRAIN --> VERTEX
    VERTEX --> ML_PRED
    ML_PRED --> BQ_PRED
    BQ_PRED --> BQ_FINAL
    
    %% Backend Integration
    BQ_FINAL --> API_ROUTES
    BQ_RAW --> API_ROUTES
    FIREBASE_AUTH --> NEXTJS
    FIRESTORE --> API_ROUTES
    FIREBASE_RULES --> FIRESTORE
    
    %% AI Integration
    DIALOGFLOW --> API_ROUTES
    GEMMA --> DIALOGFLOW
    API_ROUTES --> CHAT
    
    %% Frontend Components
    NEXTJS --> DASHBOARD
    NEXTJS --> MAINTENANCE
    NEXTJS --> CHAT
    NEXTJS --> FLIGHTS
    API_ROUTES --> NEXTJS
    
    %% User Interactions
    DASHBOARD --> LOGISTICS
    MAINTENANCE --> LOGISTICS
    MAINTENANCE --> TECHNICIAN
    CHAT --> LOGISTICS
    FLIGHTS --> LOGISTICS
    NEXTJS --> ADMIN
    
    %% Deployment
    NEXTJS --> VERCEL
    FIREBASE_AUTH --> GCP
    FIRESTORE --> GCP
    DIALOGFLOW --> GCP
    VERTEX --> GCP
    
    %% ===== STYLING =====
    classDef dataSource fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#0d47a1,font-weight:bold
    classDef etl fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#e65100,font-weight:bold
    classDef warehouse fill:#e8f5e8,stroke:#388e3c,stroke-width:3px,color:#1b5e20,font-weight:bold
    classDef ml fill:#fce4ec,stroke:#c2185b,stroke-width:3px,color:#880e4f,font-weight:bold
    classDef backend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#4a148c,font-weight:bold
    classDef ai fill:#e1f5fe,stroke:#0277bd,stroke-width:3px,color:#01579b,font-weight:bold
    classDef frontend fill:#e8f5e8,stroke:#43a047,stroke-width:3px,color:#2e7d32,font-weight:bold
    classDef user fill:#fff8e1,stroke:#ffa000,stroke-width:3px,color:#ff6f00,font-weight:bold
    classDef deployment fill:#fafafa,stroke:#616161,stroke-width:3px,color:#212121,font-weight:bold
    classDef api fill:#ffebee,stroke:#d32f2f,stroke-width:3px,color:#b71c1c,font-weight:bold
    
    %% Apply Styles
    class API,WEATHER,MANUAL dataSource
    class FVT,TRANSFORM etl
    class BQ_RAW,BQ_TRAIN,BQ_PRED,BQ_FINAL warehouse
    class ML_TRAIN,ML_PRED,VERTEX ml
    class FIREBASE_AUTH,FIRESTORE,FIREBASE_RULES backend
    class DIALOGFLOW,GEMMA ai
    class NEXTJS,DASHBOARD,MAINTENANCE,CHAT,FLIGHTS frontend
    class LOGISTICS,TECHNICIAN,ADMIN user
    class VERCEL,GCP deployment
    class API_ROUTES api
```

## 🚀 Features

### ✅ **Complete Feature Set**

#### 🔍 **Advanced Search & Filtering**
- **Global Search**: Search across flight numbers, aircraft types, users, and descriptions
- **Multi-Filter System**: Filter by status, maintenance type, date ranges
- **Real-time Results**: Instant filtering with live result counts
- **Smart Suggestions**: Auto-complete and search history

#### ☑️ **Multi-Select Operations**
- **Bulk Actions**: Select multiple entries for batch operations
- **Visual Feedback**: Clear selection indicators and counters
- **Persistent Selections**: Maintain selections across filter changes
- **Smart Controls**: Select all/none with header checkbox

#### 🗑️ **Data Management**
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Confirmation Dialogs**: Prevent accidental data loss
- **Real-time Sync**: Immediate Firebase synchronization
- **Audit Trail**: Track all changes with user attribution

#### 🤖 **AI-Powered Chat Assistant**
- **Dialogflow CX Integration**: Advanced conversational AI
- **Gemma 3 4B Model**: Sophisticated natural language processing
- **Context Awareness**: Maintains conversation history and context
- **Multi-modal Support**: Text and voice interactions

#### 🔐 **Authentication & Security**
- **Firebase Authentication**: Secure user management
- **Google OAuth**: One-click social login
- **Security Rules**: Granular Firestore access control
- **Session Management**: Secure token handling

#### 📊 **Analytics & Monitoring**
- **Real-time Dashboard**: Live metrics and KPIs
- **Performance Tracking**: System health monitoring
- **User Analytics**: Usage patterns and insights
- **Maintenance Statistics**: Predictive analytics

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.5.6**: React framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5.0**: Type-safe development
- **Tailwind CSS 4.0**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Modern icon library

### **Backend & Database**
- **Firebase 12.5.0**: Backend-as-a-Service platform
- **Cloud Firestore**: NoSQL real-time database
- **Firebase Authentication**: User management
- **BigQuery**: Data warehouse and analytics
- **Google Cloud Functions**: Serverless computing

### **AI & Machine Learning**
- **Dialogflow CX**: Conversational AI platform
- **Google Vertex AI**: ML model management
- **Gemma 3 4B**: Large language model
- **BigQuery ML**: In-database machine learning

### **Infrastructure & Deployment**
- **Vercel**: Edge deployment platform
- **Google Cloud Platform**: Cloud infrastructure
- **Fivetran**: Data pipeline orchestration
- **OpenSky Network**: Real-time flight data

## 📁 Project Structure

```
flighttrackerAi/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API routes
│   │   │   ├── chat/             # Dialogflow integration
│   │   │   ├── maintenance/      # CRUD operations
│   │   │   └── flights/          # Flight data endpoints
│   │   ├── 📁 chat/              # Chat interface pages
│   │   ├── 📁 maintenance/       # Maintenance management
│   │   ├── 📁 flights/           # Flight tracking
│   │   └── layout.tsx            # Root layout
│   ├── 📁 components/            # React components
│   │   ├── 📁 auth/              # Authentication components
│   │   ├── 📁 chat/              # Chat interface
│   │   ├── 📁 dashboard/         # Dashboard widgets
│   │   ├── 📁 maintenance/       # Maintenance forms
│   │   └── 📁 layout/            # Layout components
│   ├── 📁 contexts/              # React contexts
│   │   ├── AuthContext.tsx       # Authentication state
│   │   ├── chat-context.tsx      # Chat state management
│   │   └── maintenance-context.tsx # Maintenance data
│   ├── 📁 lib/                   # Utility libraries
│   │   ├── firebase.ts           # Firebase configuration
│   │   ├── dialogflow.ts         # AI integration
│   │   └── utils.ts              # Helper functions
│   └── 📁 hooks/                 # Custom React hooks
├── 📁 credentials/               # Service account keys
├── 📁 public/                    # Static assets
├── 📁 scripts/                   # Build and deployment scripts
├── 📄 package.json               # Dependencies and scripts
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 .env.local                 # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm 8+**
- **Google Cloud Project** with enabled APIs
- **Firebase Project** with Firestore and Authentication

### 1. Clone Repository
```bash
git clone https://github.com/VIDITJAIN7/AeroTrackAI.git
cd AeroTrackAI/flighttrackerAi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp env.template .env.local
```

Configure your `.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Dialogflow CX Configuration
GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account.json
DIALOGFLOW_CX_PROJECT_ID=your_project_id
DIALOGFLOW_CX_LOCATION=global
DIALOGFLOW_CX_AGENT_ID=your_agent_id
DIALOGFLOW_LANGUAGE_CODE=en-US

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Firebase Setup
1. **Create Firebase Project**: [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication**: Email/Password + Google OAuth
3. **Create Firestore Database**: Start in test mode
4. **Configure Security Rules**: See [Firestore Rules](#firestore-security-rules)

### 5. Google Cloud Setup
1. **Enable APIs**:
   - Dialogflow API
   - Cloud Firestore API
   - Firebase Authentication API
2. **Create Service Account**: Download JSON credentials
3. **Place credentials**: `./credentials/service-account.json`

### 6. Dialogflow CX Setup
1. **Create Agent**: [Dialogflow CX Console](https://dialogflow.cloud.google.com/cx/)
2. **Configure Intents**: Welcome, Flight Status, Maintenance, Help
3. **Deploy Agent**: Ensure agent is active and published

### 7. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Firestore Security Rules
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Maintenance entries - users can only access their own entries
    match /maintenance/{maintenanceId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid) &&
        (request.resource == null || request.resource.data.userId == request.auth.uid);
    }
  }
}
```

### Dialogflow CX Intents

#### Welcome Intent
- **Training Phrases**: "Hello", "Hi", "Good morning", "Help me"
- **Response**: "Hello! I'm your flight management assistant. How can I help you today?"

#### Flight Status Intent
- **Training Phrases**: 
  - "What's the status of flight [flight_number]?"
  - "Is flight [flight_number] on time?"
- **Response**: "I can help you check the status of flight [flight_number]. Let me look that up for you."

#### Maintenance Schedule Intent
- **Training Phrases**:
  - "When is the next maintenance scheduled?"
  - "Show me maintenance schedule"
- **Response**: "I can show you the maintenance schedule. Let me pull that information for you."

## 🚀 Deployment

### Vercel Deployment

#### 1. Connect Repository
- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Import your GitHub repository
- Select `flighttrackerAi` as root directory

#### 2. Environment Variables
Add all environment variables from `.env.local` to Vercel:

```env
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account",...}
DIALOGFLOW_CX_PROJECT_ID=your_project_id
DIALOGFLOW_CX_LOCATION=global
DIALOGFLOW_CX_AGENT_ID=your_agent_id
DIALOGFLOW_LANGUAGE_CODE=en-US
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### 3. Build Configuration
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 4. Deploy
```bash
npm run build  # Test build locally
# Push to GitHub - Vercel auto-deploys
```

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### API Testing
```bash
# Test Dialogflow integration
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me with flight information?"}'

# Test maintenance API
curl -X POST http://localhost:3000/api/maintenance \
  -H "Content-Type: application/json" \
  -d '{"flightNumber": "FL123", "aircraftType": "Boeing 737"}'
```

### Firebase Testing
```bash
# Test Firebase connection
curl http://localhost:3000/api/test-firebase

# Test Firestore operations
curl -X POST http://localhost:3000/api/test-maintenance \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user-id"}'
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Authentication Errors
- **Issue**: "Authentication failed"
- **Solution**: Check service account JSON file location and permissions
- **Verify**: `GOOGLE_APPLICATION_CREDENTIALS` path is correct

#### 2. Firestore Permission Denied
- **Issue**: "Missing or insufficient permissions"
- **Solution**: Update Firestore security rules
- **Check**: User authentication status and rule configuration

#### 3. Dialogflow Agent Not Found
- **Issue**: "No DesignTimeAgent found"
- **Solution**: Create and configure Dialogflow CX agent
- **Verify**: Agent ID and project ID match configuration

#### 4. Build Failures
- **Issue**: TypeScript or build errors
- **Solution**: 
  ```bash
  npm run type-check  # Check TypeScript errors
  npm run lint        # Check linting issues
  npm run lint:fix    # Auto-fix linting issues
  ```

#### 5. Environment Variables
- **Issue**: Configuration not loading
- **Solution**: Verify `.env.local` file exists and variables are correctly named
- **Check**: Restart development server after changes

### Debug Commands
```bash
# Check Node.js version
node --version  # Should be 18+

# Verify dependencies
npm list

# Check build output
npm run build

# Validate environment
npm run type-check
```

## 📊 Performance Optimization

### Frontend Optimization
- **Next.js Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-rendered pages for better performance
- **Edge Functions**: Vercel Edge Runtime for faster responses

### Database Optimization
- **Firestore Indexes**: Optimized queries with proper indexing
- **Client-side Sorting**: Reduced server load with local sorting
- **Pagination**: Efficient data loading with pagination
- **Caching**: Strategic caching for frequently accessed data

### AI Integration Optimization
- **Response Caching**: Cache common AI responses
- **Batch Processing**: Group multiple requests when possible
- **Fallback Responses**: Graceful degradation for AI failures
- **Context Management**: Efficient conversation context handling

## 🔐 Security

### Authentication Security
- **Firebase Authentication**: Industry-standard security
- **JWT Tokens**: Secure token-based authentication
- **OAuth Integration**: Secure Google OAuth implementation
- **Session Management**: Automatic token refresh and validation

### Data Security
- **Firestore Rules**: Granular access control
- **User Isolation**: Users can only access their own data
- **Input Validation**: Server-side validation for all inputs
- **XSS Protection**: Built-in Next.js security features

### API Security
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Environment Variables**: Secure credential management
- **HTTPS Enforcement**: SSL/TLS encryption for all communications

## 📈 Monitoring & Analytics

### Application Monitoring
- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Core Web Vitals tracking
- **User Analytics**: Usage patterns and insights

### Database Monitoring
- **Firestore Metrics**: Read/write operations tracking
- **Query Performance**: Slow query identification
- **Storage Usage**: Database size and growth monitoring
- **Security Events**: Access pattern analysis

### AI Performance
- **Response Times**: Dialogflow response latency
- **Success Rates**: AI query success/failure rates
- **User Satisfaction**: Conversation quality metrics
- **Usage Patterns**: Popular queries and intents

## 🤝 Contributing

### Development Workflow
1. **Fork Repository**: Create your own fork
2. **Create Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature
4. **Test Changes**: Run tests and verify functionality
5. **Commit Changes**: `git commit -m 'Add amazing feature'`
6. **Push Branch**: `git push origin feature/amazing-feature`
7. **Create PR**: Submit pull request for review

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

### Testing Requirements
- **Unit Tests**: Test individual components
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Ensure optimal performance

## 📚 Documentation

### API Documentation
- **REST Endpoints**: Complete API reference
- **WebSocket Events**: Real-time communication
- **Authentication**: Security implementation details
- **Error Codes**: Comprehensive error handling guide

### Component Documentation
- **React Components**: Props and usage examples
- **Context Providers**: State management patterns
- **Custom Hooks**: Reusable logic documentation
- **Utility Functions**: Helper function reference

### Deployment Guides
- **Vercel Deployment**: Step-by-step deployment guide
- **Environment Setup**: Configuration instructions
- **Domain Configuration**: Custom domain setup
- **SSL Certificate**: HTTPS configuration

## 🆘 Support

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Community support and questions
- **Documentation**: Comprehensive guides and tutorials
- **Examples**: Sample implementations and use cases

### Resources
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Firebase Documentation**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Dialogflow CX**: [cloud.google.com/dialogflow](https://cloud.google.com/dialogflow)
- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenSky Network**: Real-time flight data API
- **Google Cloud Platform**: AI and infrastructure services
- **Vercel**: Deployment and hosting platform
- **Firebase**: Backend-as-a-Service platform
- **Next.js Team**: React framework development
- **Tailwind CSS**: Utility-first CSS framework

---

<div align="center">

**Built with ❤️ by the AeroTrack AI Team**

[🌐 Live Demo](https://aerotrack-ai.vercel.app) • [📖 Documentation](https://docs.aerotrack-ai.com) • [🐛 Report Bug](https://github.com/VIDITJAIN7/AeroTrackAI/issues) • [✨ Request Feature](https://github.com/VIDITJAIN7/AeroTrackAI/issues)

</div>
