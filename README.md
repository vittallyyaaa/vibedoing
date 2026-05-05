# VibeDoing

VibeDoing is a fullstack internal workflow intelligence application designed to help companies track how work is performed, understand workload distribution, and identify execution risks early.

The system provides a centralized way to manage tasks and analyze team productivity using structured data and lightweight AI insights.

---

## 🚀 Tech Stack

**Frontend**
- Next.js (App Router)
- TypeScript
- CSS (custom UI)

**Backend**
- FastAPI
- SQLAlchemy
- SQLite
- JWT authentication

**Architecture**
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