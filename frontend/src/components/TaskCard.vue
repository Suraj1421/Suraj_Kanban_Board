<template>
  <div
    class="task-card"
    :class="[`task-card--priority-${task.priority}`, { 'task-card--done': task.status === 'done' }]"
    :data-task-id="task._id"
    role="article"
    :aria-label="`Task: ${task.title}`"
  >
    <!-- Drag handle area + Priority stripe -->
    <div class="card-priority-bar" :class="`card-priority-bar--${task.priority}`" aria-hidden="true"></div>

    <div class="card-body">
      <!-- Top row: title + actions -->
      <div class="card-top">
        <div class="card-drag-hint" aria-hidden="true">
          <span></span><span></span>
          <span></span><span></span>
          <span></span><span></span>
        </div>

        <h3 class="card-title" :class="{ 'card-title--done': task.status === 'done' }">
          {{ task.title }}
        </h3>

        <button
          class="card-delete"
          @click.stop="$emit('delete')"
          aria-label="Delete task"
          title="Delete"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="2" y1="2" x2="12" y2="12"/>
            <line x1="12" y1="2" x2="2" y2="12"/>
          </svg>
        </button>
      </div>

      <!-- Description -->
      <p v-if="task.description" class="card-description">
        {{ task.description }}
      </p>

      <!-- Footer: priority badge + date -->
      <div class="card-footer">
        <span class="priority-badge" :class="`priority-badge--${task.priority}`">
          <span class="priority-dot" aria-hidden="true"></span>
          {{ task.priority }}
        </span>

        <span class="card-date" :title="fullDate">
          {{ relativeDate }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['delete'])

/** Human-friendly relative date (e.g., "2h ago", "3 days ago") */
const relativeDate = computed(() => {
  if (!props.task.createdAt) return ''
  const diff = Date.now() - new Date(props.task.createdAt).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
})

/** Full date for tooltip */
const fullDate = computed(() => {
  if (!props.task.createdAt) return ''
  return new Date(props.task.createdAt).toLocaleString()
})
</script>

<style scoped>
.task-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: grab;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast),
              border-color var(--transition-fast), background var(--transition-fast);
  animation: fadeIn 0.3s ease both;
}

.task-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
}

.task-card:active { cursor: grabbing; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.5); }

/* Done state */
.task-card--done {
  opacity: 0.65;
}

/* Priority left stripe */
.card-priority-bar {
  position: absolute;
  left: -1px; top: 12px; bottom: 12px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px currentColor;
}
.card-priority-bar--high { background: var(--priority-high); }
.card-priority-bar--medium { background: var(--priority-medium); }
.card-priority-bar--low { background: var(--priority-low); }

/* Body */
.card-body {
  padding: var(--space-3) var(--space-4) var(--space-3) calc(var(--space-4) + 4px);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

/* Top row */
.card-top {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

.card-drag-hint {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3px;
  padding-top: 3px;
  opacity: 0;
  transition: opacity var(--transition-fast);
  flex-shrink: 0;
}
.task-card:hover .card-drag-hint { opacity: 1; }
.card-drag-hint span {
  display: block;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: var(--text-muted);
}

.card-title {
  flex: 1;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.4;
  letter-spacing: -0.01em;
}
.card-title--done {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.card-delete {
  opacity: 0;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 3px;
  border-radius: var(--radius-sm);
  transition: opacity var(--transition-fast), color var(--transition-fast), background var(--transition-fast);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.task-card:hover .card-delete { opacity: 1; }
.card-delete:hover {
  color: var(--priority-high);
  background: rgba(255, 107, 107, 0.1);
}

/* Description */
.card-description {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-1);
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-weight: 700;
  border: 1px solid transparent;
}
.priority-badge--high { background: rgba(255,107,107,0.1); color: var(--priority-high); border-color: rgba(255,107,107,0.2); }
.priority-badge--medium { background: rgba(255,209,102,0.1); color: var(--priority-medium); border-color: rgba(255,209,102,0.2); }
.priority-badge--low { background: rgba(86,207,178,0.1); color: var(--priority-low); border-color: rgba(86,207,178,0.2); }

.priority-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.card-date {
  font-size: 0.78rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
