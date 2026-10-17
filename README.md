# GrabJob - Smart Job Discovery & Career Assistance Platform

GrabJob is a modern, production-ready MERN (MongoDB, Express, React, Node.js) platform crafted for the Indian job ecosystem. It provides verified job discovery, geospatial walk-in interview tracking, AI career coaching, an ATS resume builder, and high-touch interview assistance.

---

## 🌟 Key Features

1. **Geospatial Walk-in Interviews with Leaflet Map**
   - Interactive OpenStreetMap integration with custom markers and city centers (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Pune, Kolkata).
   - Radius-based geolocation discovery using MongoDB `$nearSphere` 2dsphere indexes.
   - Walk-in specifics: exact interview address, reporting timings, recruiter desks, required documents list, and Google Maps directions.

2. **Career Assistance Services & Payments (Razorpay Integration)**
   - **ATS Resume Builder (₹50)**: PDF/DOCX resume parser (`mammoth`, `pdf-parse`) and generation (`pdf-lib`, `docx`) with live ATS keyword matching and score gauge.
   - **Walk-in Interview Assistance (₹100)**: Turn-by-turn guidance, priority slot scheduling, interview checklist, and company briefing pack.
   - Safe simulation payment mode when Razorpay API credentials are not provided.

3. **AI Career Coach & Intelligent Chatbot**
   - Floating AI chatbot powered by OpenAI `gpt-4o-mini` with intelligent rule-based heuristic fallback when offline or API key is absent.
   - Context-aware salary estimations, interview preparation tips, and resume review recommendations.

4. **Multi-Role Role-Based Access Control (RBAC)**
   - **Public**: Browse verified jobs, walk-ins, freelance gigs, and interactive map.
   - **Candidate Portal**: Profile completion tracker, applied jobs pipeline, saved jobs, notifications, and assistance orders.
   - **Admin Console**: Full suite dashboard, job approval workflows, user management, payment audits, email logs, and immutable security audit trails.

5. **Compliant Job Ingestion Architecture**
   - Zero unethical scraping: relies on official employer postings, authorized APIs, and licensed feeds (`JobSource` schema).
   - Real-time badge indicators: `Direct Employer`, `Aggregated Feed`, and `Verified Posting`.

---

## 🔐 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@grabjob.in` | `Admin@123` |
| **Job Seeker / Candidate** | `candidate@grabjob.in` | `Candidate@123` |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` or MongoDB Atlas URI.

### 1. Repository Setup & Dependencies

Install root, backend, and frontend dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables Configuration

Both `backend/.env` and `frontend/.env` have been pre-configured with default working values and `.env.example` templates.

#### Backend (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/grabjob
JWT_SECRET=grabjob_super_secret_jwt_key_2025_secure_dev
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional: External Services (Gracefully simulated if left empty)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
OPENAI_API_KEY=
GOOGLE_CLIENT_ID=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder
VITE_GOOGLE_CLIENT_ID=mock-client-id
```

### 3. Seed Demo Data

Populate MongoDB with verified jobs, walk-ins, freelance projects, and demo users:
```bash
cd backend
node src/jobs/seedData.js
```

### 4. Run Automated Backend Tests

Verify authentication, JWT generation, HMAC signature verification, and geospatial calculations:
```bash
cd backend
npm run test
```

### 5. Start Development Servers

Run both Backend and Frontend concurrently from the root:
```bash
# From the project root
npm run dev
```

Or run them individually in separate terminals:
```bash
# Terminal 1: Backend (port 5000)
cd backend
npm run dev

# Terminal 2: Frontend (port 5173)
cd frontend
npm run dev
```

---

## 📁 Architecture & Directory Structure

```
GrabJob/
├── backend/
│   ├── src/
│   │   ├── config/             # DB and Environment config
│   │   ├── controllers/        # Express request controllers
│   │   ├── middleware/         # Auth, Admin RBAC, Multer, Error handlers
│   │   ├── models/             # Mongoose schemas (Jobs, Users, Payments, etc.)
│   │   ├── routes/             # Express API route declarations
│   │   ├── services/           # Payment, AI, Resume parser/builder, Email
│   │   ├── validators/         # Zod schemas for input sanitization
│   │   ├── jobs/               # Database seed scripts
│   │   └── tests/              # Backend test runner suite
│   ├── uploads/                # Local uploaded resumes directory
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/             # Static logos and icons
│   │   ├── components/
│   │   │   ├── auth/           # ProtectedRoute, AdminRoute
│   │   │   ├── chatbot/        # Floating AIChatbot component
│   │   │   ├── common/         # Navbar, Footer, MobileNav, Badges, Modals
│   │   │   ├── jobs/           # JobCard, JobFilters, JobList
│   │   │   ├── map/            # React-Leaflet JobMap & JobMarker
│   │   │   ├── payments/       # Payment modal, methods & status
│   │   │   └── resume/         # ATS resume uploader, preview & result
│   │   ├── layouts/            # MainLayout, CandidateLayout, AdminLayout
│   │   ├── pages/              # 38 public, candidate & admin screens
│   │   ├── services/           # Axios API connectors
│   │   ├── store/              # Zustand global state (auth, jobs, ui)
│   │   ├── utils/              # Constants, formatters, and coordinates
│   │   ├── App.jsx             # React Router configuration
│   │   ├── main.jsx
│   │   └── index.css           # Design tokens & responsive styles
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛡️ Security & Compliance Highlights

- **Helmet & CORS**: Hardened HTTP headers and restricted origins.
- **Express Rate Limiting**: 100 requests per 15 minutes per IP on `/api/`.
- **HMAC SHA-256 Verification**: Cryptographic payment validation for Razorpay webhook and callback integrity.
- **Audit Logging**: Immutable tracking of all administrative actions in the database.
- **Safe Resume Extraction**: File size caps (5MB) and strict MIME-type validation for PDF/DOCX.
