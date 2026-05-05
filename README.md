# VibeDoing

VibeDoing is a fullstack internal workflow intelligence application designed to help companies track how work is performed, understand workload distribution, and identify execution risks early.

The system provides a centralized way to manage tasks and analyze team productivity using structured data and lightweight AI insights.

---

## 🚀 Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Custom CSS

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- JWT authentication

### Architecture
- REST API
- Role-based access (CEO / Worker)

---

## ✨ Features

### 🌐 Landing Page
- Hero section with product positioning
- Company description
- Feature overview
- Contact form
- Navigation + Login entry point

---

### 🔐 Authentication
- Register / Login
- JWT token handling
- Role-based authorization

---

### 👷 Worker Capabilities
- Create tasks
- View only own tasks
- Update task status
- Update actual time spent

---

### 🧠 CEO Capabilities
- View all tasks across the company
- Filter tasks by:
  - Employee
  - Status
- Identify:
  - Overloaded employees
  - Tasks exceeding estimated time
- Run AI-based (mocked) insights

---

### 🤖 AI Insights (Mocked)
- Non-blocking analysis (triggered manually)
- Detects:
  - Overloaded employees
  - Risky tasks (actual > estimated)
- Displays summary and categorized insights

---

## 👤 Demo Accounts

### CEO
```

username: ceo
password: 123456

```

### Workers
```

username: alice
password: 123456

```
```

username: bob
password: 123456

````

---

## ⚙️ Local Setup

### 1. Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/vibedoing.git
cd vibedoing
````

---

## 🔧 Backend Setup

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

# Seed demo data
python -m app.seed

# Run server
uvicorn app.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

Swagger:

```
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 📊 Core Logic

### Risk Detection

A task is considered risky when:

```
actual_time > estimated_time
```

### Overload Detection

An employee is considered overloaded when:

```
total_actual_time >= 35 hours
```

---

## 🌍 Deployment

### Backend (Render)

1. Go to Render
2. Create Web Service
3. Connect GitHub repository

Settings:

```
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

---

### Frontend (Vercel)

1. Go to Vercel
2. Import GitHub repository

Settings:

```
Root Directory: frontend
Framework: Next.js
```

---

### ⚠️ IMPORTANT

Before deploying frontend, update API URL:

```
frontend/src/lib/api.ts
```

Replace:

```ts
export const API_URL = "http://127.0.0.1:8000";
```

With:

```ts
export const API_URL = "https://YOUR_BACKEND_URL";
```

---

## 🏗 Architecture

The application follows a simple client-server architecture:

* Next.js frontend communicates with FastAPI backend via REST API
* Backend handles authentication, authorization, and business logic
* SQLite database stores users and tasks
* Role-based filtering is enforced on the backend side

The system prevents role spoofing by validating user roles server-side.

---

## 🔮 Future Improvements

* Real AI integration instead of mocked insights
* Pagination for large datasets
* WebSocket updates for real-time dashboards
* Role management (admin panel)
* Better analytics (charts, trends)

---

## 📌 Notes

* AI insights are mocked (as required in the test task)
* Focus is on architecture, data flow, and UI clarity
* System is designed to be easily extendable

---

## 🎯 Project Goal

Provide leadership with a clear and fast way to:

* Understand how work is distributed
* Detect execution risks early
* Improve team efficiency through data visibility

---

## 📎 Author

Fullstack test project implementation

````

---

## 🔥 Тепер

```bash
git add README.md
git commit -m "Fix README formatting and structure"
git push
````

---