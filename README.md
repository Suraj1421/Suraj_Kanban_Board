# KanFlow — Draggable Kanban Board 📋

> A full-stack interactive task board built with **MongoDB, Express.js, Vue 3, Node.js (MEVN stack)**.

A modern, responsive kanban board application that lets you manage tasks by dragging them across different columns (To Do, In Progress, Done). Perfect for agile teams and task management!

![License](https://img.shields.io/badge/license-MIT-green) ![Node.js](https://img.shields.io/badge/Node.js-v18+-blue) ![Vue](https://img.shields.io/badge/Vue-3-green)

---

## ✨ Features

- ✅ **Drag-and-Drop** — Effortlessly move tasks between columns with smooth animations
- ✅ **Real-Time Updates** — See task counts update instantly as you work
- ✅ **Fast UI** — Changes appear immediately on screen (optimistic updates)
- ✅ **Create & Delete Tasks** — Add new tasks with a modal form or remove them
- ✅ **Priority Levels** — Organize tasks by priority (High, Medium, Low) with visual indicators
- ✅ **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- ✅ **Beautiful Animations** — Smooth transitions and visual feedback
- ✅ **Seed Data** — Quick setup with demo tasks for testing

---

## 🛠️ Tech Stack

| Layer | Technology |
|:---:|:---|
| **Frontend** | Vue 3 (Composition API), Pinia (state management), SortableJS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Styling** | Custom CSS (CSS Variables for theming) |
| **Build Tool** | Vite (fast dev server & bundling) |

---

## 📂 Project Structure

```
kanban-board/
│
├── backend/                    # Node.js + Express API
│   ├── models/
│   │   └── Task.js            # MongoDB schema (title, status, priority, etc.)
│   ├── routes/
│   │   └── tasks.js           # API routes (GET, POST, PATCH, DELETE)
│   ├── server.js              # Express app setup & MongoDB connection
│   ├── seed.js                # Script to populate database with demo data
│   ├── .env.example           # Environment variables template
│   └── package.json
│
├── frontend/                   # Vue 3 Application
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css       # Global styles (CSS variables, animations)
│   │   ├── components/
│   │   │   ├── AppHeader.vue       # Top bar with task statistics
│   │   │   ├── KanbanBoard.vue     # Main board layout (3 columns)
│   │   │   ├── KanbanColumn.vue    # Column with drag-drop functionality
│   │   │   ├── TaskCard.vue        # Individual draggable task card
│   │   │   └── AddTaskModal.vue    # Modal form to create new tasks
│   │   ├── composables/
│   │   │   └── useApi.js          # Axios HTTP client & API calls
│   │   ├── stores/
│   │   │   └── taskStore.js       # Pinia store (centralized state)
│   │   ├── App.vue                # Root component
│   │   └── main.js                # Vue app entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md                   # This file!
```

---

## 🚀 Quick Start Guide

### Prerequisites

Before you begin, make sure you have installed:
- **Node.js v18 or higher** — [Download here](https://nodejs.org/)
- **MongoDB** — Either:
  - 🖥️ **Local**: Download [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
  - ☁️ **Cloud**: Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)

Check your Node.js version:
```bash
node --version
npm --version
```

---

### Step 1️⃣ Clone & Install Dependencies

```bash
# Clone the repository (if not already done)
git clone https://github.com/Suraj1421/Suraj_Kanban_Board.git
cd kanban-board

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root directory
cd ..
```

---

### Step 2️⃣ Set Up Environment Variables

Create a `.env` file in the `backend/` folder:

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and configure:

**Option A: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/kanban_board
PORT=5000
NODE_ENV=development
```

**Option B: MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/kanban_board?appName=Cluster0
PORT=5000
NODE_ENV=development
```

> 💡 **How to get MongoDB Atlas URI**: 
> 1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
> 2. Create a cluster and database user
> 3. Click "Connect" → "Drivers" → Copy the connection string
> 4. Replace `<username>:<password>` with your credentials

---

### Step 3️⃣ Seed the Database (Optional but Recommended)

Populate your database with demo tasks to test the app:

```bash
cd backend
node seed.js
```

You should see:
```
✅ Connected to MongoDB
✅ Database seeded with 9 sample tasks!
```

---

### Step 4️⃣ Start the Servers

You'll need **two terminal windows**:

**Terminal 1 — Start the Backend Server**
```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

**Terminal 2 — Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.4.21  ready in 914 ms

  ➜  Local:   http://localhost:5173/
```

---

### Step 5️⃣ Open Your Browser

Navigate to **[http://localhost:5173](http://localhost:5173)** and start managing your tasks! 🎉

---

## 📊 How Data Flows (Architecture Overview)

This diagram shows how your frontend and backend work together:

```
┌─────────────────────────────────────────────────────────────┐
│                     Vue 3 Frontend                          │
│                  (http://localhost:5173)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. User Actions (click, drag, submit)                      │
│  ↓                                                          │
│  Components (KanbanBoard, TaskCard, etc.)                   │
│  ↓                                                          │
│  Pinia Store (taskStore.js) ← Central State Manager         │
│  ↓                                                          │
│  useApi.js (Axios HTTP Client)                              │
│  ↓                                                          │
```

```
                    HTTP REST API
        ↓  POST, GET, PATCH, DELETE  ↓
        
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Backend                        │
│                  (http://localhost:5000)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  routes/tasks.js (API Endpoints)                            │
│  ↓                                                          │
│  models/Task.js (Mongoose Schema)                           │
│  ↓                                                          │
│  MongoDB Database Connection                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-Step Data Flow Example: Creating a Task

```
1. User clicks "Add Task" button in the UI
   ↓
2. AddTaskModal.vue captures the form input (title, description, priority)
   ↓
3. User clicks "Create" → Form submits to Pinia store
   ↓
4. taskStore.js calls useApi.createTask(taskData)
   ↓
5. useApi.js sends HTTP POST request to backend:
   POST /api/tasks
   {
     "title": "Design dashboard",
     "description": "Create mockups",
     "priority": "high"
   }
   ↓
6. Backend receives request → tasks.js route handler
   ↓
7. tasks.js validates data → calls Task.create(taskData)
   ↓
8. Mongoose saves to MongoDB with auto-generated _id
   ↓
9. Backend returns new task as JSON response
   ↓
10. Frontend receives response → Pinia store adds task to state
    ↓
11. Vue components automatically re-render showing the new task ✅
```

### Step-by-Step Data Flow Example: Dragging a Task

```
1. User drags "Design dashboard" from "To Do" to "In Progress"
   ↓
2. SortableJS detects the drag → triggers onEnd() event
   ↓
3. KanbanColumn.vue emits 'task-moved' event with taskId and newStatus
   ↓
4. taskStore receives event → immediately updates local state:
   task.status = 'inprogress'
   ✨ UI updates instantly (fast perceived performance)
   ↓
5. Simultaneously, taskStore sends PATCH request to backend:
   PATCH /api/tasks/{taskId}
   { "status": "inprogress" }
   ↓
6. Backend updates the task in MongoDB
   ↓
7. If backend responds successfully → UI keeps the change ✅
   ↓
   If backend fails → Pinia reverts the status back to original
   (ensures data consistency!)
```

### Why This Architecture?

- **Optimistic Updates**: UI feels snappy because changes show instantly (not waiting for backend)
- **Centralized State**: Pinia store keeps all tasks in one place, prevents data inconsistencies
- **Separation of Concerns**: Frontend handles UI, backend handles data validation & storage
- **Real-Time Sync**: Changes sync to MongoDB in background without blocking user
- **Error Handling**: If sync fails, the UI automatically reverts changes

---

## 🔌 API Reference

All API requests go to `http://localhost:5000/api`

### Get All Tasks
```bash
GET /api/tasks
```
**Response:**
```json
[
  {
    "_id": "5f3b3f3f3f3f3f3f3f3f3f3f",
    "title": "Design dashboard",
    "description": "Create mockups and wireframes",
    "status": "inprogress",
    "priority": "high",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
]
```

### Create a New Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Build API",
  "description": "Create REST endpoints",
  "priority": "high"
}
```

### Update Task Status (e.g., when dragging)
```bash
PATCH /api/tasks/:id
Content-Type: application/json

{
  "status": "done"
}
```

### Delete a Task
```bash
DELETE /api/tasks/:id
```

### Health Check
```bash
GET /api/health
```
Returns: `{"status": "ok"}`

---

### Task Object Schema

| Field | Type | Description | Example |
|:---|:---|:---|:---|
| `_id` | String | Unique identifier (MongoDB) | `507f1f77bcf86cd799439011` |
| `title` | String | Task name | `"Build API"` |
| `description` | String | Task details | `"Create CRUD endpoints"` |
| `status` | String | Current status | `"todo"`, `"inprogress"`, `"done"` |
| `priority` | String | Priority level | `"low"`, `"medium"`, `"high"` |
| `createdAt` | Date | Creation timestamp | `2024-01-15T10:30:00Z` |
| `updatedAt` | Date | Last update timestamp | `2024-01-15T12:00:00Z` |

---

## 🏗️ Key Architecture Decisions

### Why Pinia for State Management?
- Multiple components need access to the same task list (AppHeader, KanbanColumn, TaskCard)
- Pinia provides a clean, centralized store without prop drilling
- Easy to debug and test
- Better than Context API for larger apps

### Why SortableJS for Drag-and-Drop?
- Lightweight vanilla library (no heavy framework wrapper)
- Full control over drag lifecycle (`onStart`, `onEnd`, `onEnter` events)
- The `group: 'kanban'` option enables cross-column dragging natively
- No extra wrapper dependencies needed

### Why Optimistic Updates?
- **Better UX**: Users see changes instantly, no waiting for network
- **Data Consistency**: If backend fails, the UI automatically reverts
- **Modern Pattern**: Used by Gmail, Twitter, and other fast apps
- **Smooth Animations**: No lag between user action and visual feedback

### Why Vue 3 Composition API?
- Better code organization (logic stays together)
- Superior TypeScript support (if added later)
- Easier to extract reusable composables (`useApi`, custom hooks)
- More performant than Options API for large components

---

## 🔧 Development Commands

```bash
# Frontend
cd frontend
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Build for production

# Backend
cd backend
npm run dev        # Start with nodemon (auto-restart on changes)
npm run start      # Start normally

# Database
cd backend
node seed.js       # Populate with demo data
```

---

## 🐛 Troubleshooting

### ❌ "Port 5000 already in use"
Another process is using port 5000. Fix it:
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### ❌ "Cannot connect to MongoDB"
- Check your `.env` file has correct `MONGODB_URI`
- Make sure MongoDB service is running (if local)
- For MongoDB Atlas, check firewall rules allow your IP

### ❌ "CORS errors in console"
Backend is probably not running. Make sure`npm run dev` is executed in the backend folder.

### ❌ "Tasks not appearing"
- Refresh browser (Ctrl+F5)
- Check browser DevTools Console for errors
- Ensure backend is running on port 5000

---

## 📝 Example Workflow

1. **Start both servers** (see Quick Start)
2. **Run seed script** to populate with demo tasks
3. **Open browser** to http://localhost:5173
4. **Create a task** using the "+" button
5. **Drag tasks** between columns
6. **Delete tasks** using the trash icon
7. **Watch statistics** update in real-time

---


## 📄 License

This project is open source and available under the MIT License.


