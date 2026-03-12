<template>
  <header class="app-header">
    <div class="header-inner">
      <!-- Logo -->
      <div class="header-logo">
        <div class="logo-icon" aria-hidden="true">
          <span class="logo-dot logo-dot--1"></span>
          <span class="logo-dot logo-dot--2"></span>
          <span class="logo-dot logo-dot--3"></span>
        </div>
        <span class="logo-text">Kan<em>Flow</em></span>
      </div>

      <!-- Stats bar -->
      <div class="header-stats" role="status" aria-live="polite">
        <div class="stat-chip">
          <span class="stat-dot" style="background: var(--col-todo)"></span>
          <span class="stat-value">{{ store.counts.todo }}</span>
          <span class="stat-label">To Do</span>
        </div>
        <div class="stat-divider" aria-hidden="true"></div>
        <div class="stat-chip">
          <span class="stat-dot" style="background: var(--col-progress)"></span>
          <span class="stat-value">{{ store.counts.inprogress }}</span>
          <span class="stat-label">In Progress</span>
        </div>
        <div class="stat-divider" aria-hidden="true"></div>
        <div class="stat-chip">
          <span class="stat-dot" style="background: var(--col-done)"></span>
          <span class="stat-value">{{ store.counts.done }}</span>
          <span class="stat-label">Done</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="header-progress" aria-label="Completion progress">
        <span class="progress-label">{{ completionPercent }}% complete</span>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: completionPercent + '%' }"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const store = useTaskStore()

const completionPercent = computed(() => {
  if (store.totalTasks === 0) return 0
  return Math.round((store.counts.done / store.totalTasks) * 100)
})
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-subtle);
}

.header-inner {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
}
.logo-icon {
  display: flex;
  gap: 3px;
  align-items: flex-end;
}
.logo-dot {
  display: block;
  border-radius: 2px;
  width: 6px;
}
.logo-dot--1 { height: 12px; background: var(--col-todo); }
.logo-dot--2 { height: 18px; background: var(--col-progress); }
.logo-dot--3 { height: 9px; background: var(--col-done); }

.logo-text {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}
.logo-text em {
  font-style: normal;
  color: var(--col-progress);
}

/* Stats */
.header-stats {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
}
.stat-chip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.stat-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
}
.stat-value {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
  min-width: 16px;
  text-align: center;
  transition: all 0.3s ease;
}
.stat-label {
  font-size: 0.78rem;
  color: var(--text-secondary);
  white-space: nowrap;
}
.stat-divider {
  width: 1px;
  height: 20px;
  background: var(--border-subtle);
}

/* Progress */
.header-progress {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-left: auto;
}
.progress-label {
  font-size: 0.78rem;
  color: var(--text-secondary);
  white-space: nowrap;
  font-family: var(--font-display);
}
.progress-track {
  width: 100px;
  height: 4px;
  background: var(--border-subtle);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--col-progress), var(--col-done));
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

@media (max-width: 768px) {
  .header-progress { display: none; }
  .header-inner { gap: var(--space-3); padding: var(--space-3) var(--space-4); }
}
@media (max-width: 480px) {
  .stat-label { display: none; }
}
</style>
