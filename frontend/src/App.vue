<template>
  <div class="app-root">
    <!-- Ambient background orbs -->
    <div class="bg-orb bg-orb--1" aria-hidden="true"></div>
    <div class="bg-orb bg-orb--2" aria-hidden="true"></div>
    <div class="bg-orb bg-orb--3" aria-hidden="true"></div>

    <AppHeader />

    <main class="main-content">
      <!-- Error Toast -->
      <Transition name="toast">
        <div v-if="store.error" class="error-toast" role="alert">
          <span class="error-toast__icon">⚠</span>
          <span class="error-toast__msg">{{ store.error }}</span>
          <button class="error-toast__close" @click="store.clearError" aria-label="Dismiss">✕</button>
        </div>
      </Transition>

      <!-- Loading state -->
      <div v-if="store.isLoading" class="loading-state" aria-label="Loading tasks">
        <div class="loading-spinner"></div>
        <p class="loading-text">Fetching your tasks…</p>
      </div>

      <!-- Kanban Board -->
      <KanbanBoard v-else />
    </main>

    <!-- Add Task Modal -->
    <AddTaskModal v-if="showModal" @close="showModal = false" />

    <!-- FAB Button -->
    <button class="fab" @click="showModal = true" aria-label="Add new task">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round">
        <line x1="10" y1="3" x2="10" y2="17"/>
        <line x1="3" y1="10" x2="17" y2="10"/>
      </svg>
      <span>New Task</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import AppHeader from '@/components/AppHeader.vue'
import KanbanBoard from '@/components/KanbanBoard.vue'
import AddTaskModal from '@/components/AddTaskModal.vue'

const store = useTaskStore()
const showModal = ref(false)

onMounted(() => {
  store.fetchTasks()
})
</script>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

/* Ambient background orbs */
.bg-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  z-index: 0;
  opacity: 0.55;
}
.bg-orb--1 {
  width: 800px; height: 800px;
  top: -200px; left: -200px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.15), transparent 70%);
  animation: float 14s ease-in-out infinite;
}
.bg-orb--2 {
  width: 600px; height: 600px;
  top: 40%; right: -250px;
  background: radial-gradient(circle, rgba(124, 140, 248, 0.12), transparent 70%);
  animation: float 18s ease-in-out infinite reverse;
}
.bg-orb--3 {
  width: 500px; height: 500px;
  bottom: -150px; left: 30%;
  background: radial-gradient(circle, rgba(255, 209, 102, 0.08), transparent 70%);
  animation: float 22s ease-in-out infinite 4s;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 1;
  padding: var(--space-6) var(--space-6) var(--space-12);
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  padding: 80px 0;
}
.loading-spinner {
  width: 40px; height: 40px;
  border: 3px solid var(--border-subtle);
  border-top-color: var(--col-progress);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.loading-text {
  font-family: var(--font-display);
  color: var(--text-secondary);
  font-size: 0.9rem;
  letter-spacing: 0.05em;
}

/* Error Toast */
.error-toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: rgba(255, 107, 107, 0.12);
  border: 1px solid rgba(255, 107, 107, 0.3);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-4);
  max-width: 600px;
  margin-inline: auto;
  backdrop-filter: blur(12px);
}
.error-toast__icon { font-size: 1rem; color: #ff6b6b; }
.error-toast__msg { font-size: 0.9rem; color: var(--text-primary); flex: 1; }
.error-toast__close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}
.error-toast__close:hover { color: var(--text-primary); }

/* Toast transition */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-8px); }

/* FAB */
.fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 14px 22px;
  background: rgba(167, 139, 250, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: var(--radius-full);
  color: var(--col-progress);
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(167, 139, 250, 0.1);
  transition: all var(--transition-default);
}
.fab:hover {
  transform: translateY(-2px) scale(1.03);
  background: rgba(167, 139, 250, 0.25);
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: 0 12px 40px rgba(167, 139, 250, 0.3), 0 4px 12px rgba(0,0,0,0.5);
  color: #fff;
}
.fab:active { transform: translateY(0) scale(0.98); }

@media (max-width: 600px) {
  .fab span { display: none; }
  .fab { padding: 16px; bottom: 24px; right: 20px; }
  .main-content { padding: var(--space-4) var(--space-3) 100px; }
}
</style>
