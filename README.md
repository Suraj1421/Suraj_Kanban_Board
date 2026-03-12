# KanFlow — Draggable Kanban Board

> A full-stack interactive task board built with **MongoDB, Express.js, Vue 3, Node.js (MEVN stack)**.

---

## ✦ Features

- **Drag-and-drop** task cards between columns using SortableJS (cross-column)
- **Real-time column counts** updating on every drag/create/delete
- **Optimistic UI updates** — state changes instantly, then syncs to DB (reverts on failure)
- **Add / Delete tasks** with a polished modal form
- **Priority levels** (High / Medium / Low) with visual indicators
- **Responsive design** — works on mobile, tablet, and desktop
- **Animated UI** — smooth transitions on card movement, count changes, and modals

---

## ✦ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 (Composition API), Pinia, SortableJS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Styling | Custom CSS (CSS Variables, no framework) |
| Build | Vite |

---

## ✦ Architecture Decisions

### Why Pinia?
Multiple components (3 columns + header + FAB) need to react to the same task list simultaneously. Pinia provides a clean, centralized store with explicit mutations — avoiding prop drilling and keeping each component focused on presentation.

### Why SortableJS (not vue-draggable)?
SortableJS is the lightweight vanilla library that vue-draggable wraps. Using it directly gives full control over the drag lifecycle (`onStart`, `onEnd`, `onEnter`) and avoids adding an extra dependency. The `group: 'kanban'` option enables cross-column dragging natively.

### Optimistic Updates
When a card is dragged, the UI updates immediately (snappy UX). The PATCH request is sent concurrently. If it fails, the store reverts the task to its previous status — ensuring data consistency without sacrificing perceived performance.

### Vue Composition API (`ref`, `reactive`, `computed`)
All state and logic uses the Composition API for:
- Colocation of related logic
- Better TypeScript ergonomics (if added later)
- Easier extraction of reusable composables

---

## ✦ Project Structure

```
kanban-board/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose schema
│   ├── routes/
│   │   └── tasks.js         # Express router: GET, POST, PATCH, DELETE
│   ├── server.js            # App entry: Express + MongoDB
│   ├── seed.js              # Seed script for demo data
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   │   └── main.css     # Global design system (CSS variables, animations)
    │   ├── components/
    │   │   ├── AppHeader.vue       # Sticky header with live stats bar
    │   │   ├── KanbanBoard.vue     # Board layout, 3-column grid
    │   │   ├── KanbanColumn.vue    # Column with SortableJS drag-drop
    │   │   ├── TaskCard.vue        # Individual draggable card
    │   │   └── AddTaskModal.vue    # Create task form modal
    │   ├── composables/
    │   │   └── useApi.js           # Axios service layer
    │   ├── stores/
    │   │   └── taskStore.js        # Pinia store (central state)
    │   ├── App.vue                 # Root component
    │   └── main.js                 # Vue app bootstrap
    ├── index.html
    └── vite.config.js
```

---

## ✦ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# In backend/
cp .env.example .env
# Edit .env:
# MONGODB_URI=mongodb://localhost:27017/kanban_board
# PORT=5000
```

### 3. Seed Demo Data (optional)

```bash
cd backend
node seed.js
```

### 4. Run Development Servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev      # starts on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev      # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✦ API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PATCH` | `/api/tasks/:id` | Update task (status, title, priority, etc.) |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/health` | Health check |

### Task Object
```json
{
  "_id": "...",
  "title": "Build REST API",
  "description": "Create CRUD endpoints with validation",
  "status": "inprogress",
  "priority": "high",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### Status values: `todo` | `inprogress` | `done`
### Priority values: `low` | `medium` | `high`

---

## ✦ Key Component Explanations

### `KanbanColumn.vue` — Drag and Drop
```js
// SortableJS initialized with shared group name
Sortable.create(listRef.value, {
  group: 'kanban',    // all 3 columns share this group → cross-column drag works
  animation: 200,
  onEnd(event) {
    // Only emit when column changes
    if (event.from !== event.to) {
      emit('task-moved', { taskId, newStatus: targetColumnId })
    }
  }
})
```

### `taskStore.js` — Optimistic Update Pattern
```js
async function moveTask(taskId, newStatus) {
  const task = tasks.value.find(t => t._id === taskId)
  const previousStatus = task.status
  task.status = newStatus      // ← instant UI update
  try {
    await taskApi.updateStatus(taskId, { status: newStatus })  // ← async DB sync
  } catch {
    task.status = previousStatus  // ← revert if DB fails
  }
}
```
