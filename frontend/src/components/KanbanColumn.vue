<template>
  <div
    class="kanban-column"
    :class="[`kanban-column--${accent}`, { 'kanban-column--drag-over': isDragOver }]"
  >
    <!-- Column Header -->
    <div class="column-header">
      <div class="column-title-row">
        <span class="column-icon" aria-hidden="true">{{ icon }}</span>
        <h2 class="column-title">{{ title }}</h2>
        <Transition name="count" mode="out-in">
          <span :key="tasks.length" class="column-count" :class="`column-count--${accent}`">
            {{ tasks.length }}
          </span>
        </Transition>
      </div>
      <div class="column-accent-line"></div>
    </div>

    <!-- SortableJS is attached to this ref — it is the DIRECT parent of .task-card divs -->
    <div
      ref="sortableRef"
      class="task-list"
      :class="{ 'task-list--empty': tasks.length === 0 }"
      :data-column-id="columnId"
    >
      <!-- Empty state: shown only when no tasks -->
      <div v-if="tasks.length === 0" class="empty-state" aria-label="No tasks">
        <div class="empty-state__icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="4" y="6" width="24" height="20" rx="3"/>
            <line x1="10" y1="12" x2="22" y2="12"/>
            <line x1="10" y1="17" x2="17" y2="17"/>
          </svg>
        </div>
        <p class="empty-state__text">Drop tasks here</p>
      </div>

      <!-- Each TaskCard renders a div with data-task-id — SortableJS picks these up individually -->
      <TaskCard
        v-for="task in tasks"
        :key="task._id"
        :task="task"
        @delete="store.deleteTask(task._id)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sortable from 'sortablejs'
import { useTaskStore } from '@/stores/taskStore'
import TaskCard from '@/components/TaskCard.vue'

const props = defineProps({
  columnId: { type: String, required: true },
  title: { type: String, required: true },
  accent: { type: String, required: true },
  icon: { type: String, required: true },
  tasks: { type: Array, default: () => [] }
})

const emit = defineEmits(['task-moved'])

const store = useTaskStore()
const sortableRef = ref(null)
const isDragOver = ref(false)
let sortable = null

onMounted(() => {
  initSortable()
})

onUnmounted(() => {
  sortable?.destroy()
})

/**
 * SortableJS attached directly to sortableRef which is the immediate parent
 * of every .task-card element. No extra wrapper div — this is what fixes
 * the "all cards dragging together" bug. The filter excludes the empty-state
 * div so it can never be dragged.
 */
function initSortable() {
  sortable = Sortable.create(sortableRef.value, {
    group: 'kanban',           // shared group name = cross-column drag works
    animation: 200,
    ghostClass: 'sortable-ghost',
    chosenClass: 'sortable-chosen',
    dragClass: 'sortable-drag',
    filter: '.empty-state',    // never drag the empty-state placeholder
    delay: 0,                  // no delay = responsive on desktop
    delayOnTouchOnly: true,    // small delay only on touch screens

    onStart() {
      document.body.style.cursor = 'grabbing'
    },

    onEnd(event) {
      document.body.style.cursor = ''
      isDragOver.value = false

      const taskId = event.item.dataset.taskId
      const targetColumnId = event.to.dataset.columnId

      if (event.from !== event.to && taskId && targetColumnId) {
        emit('task-moved', { taskId, newStatus: targetColumnId })
      }
    },

    onEnter() { isDragOver.value = true },
    onLeave() { isDragOver.value = false }
  })
}
</script>

<style scoped>
.kanban-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  border-radius: var(--radius-xl);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  padding: var(--space-5);
  box-shadow: var(--glass-shadow);
  transition: border-color var(--transition-default), box-shadow var(--transition-default), transform var(--transition-default);
  min-height: 300px;
  position: relative;
  overflow: hidden;
}

/* Glowing Top Edge */
.kanban-column::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1.5px;
  background: linear-gradient(90deg, transparent, var(--col-accent), transparent);
  box-shadow: 0 2px 12px var(--col-glow);
  opacity: 0.8;
  transition: opacity var(--transition-default);
}

.kanban-column--todo { --col-accent: var(--col-todo); --col-dim: var(--col-todo-dim); --col-glow: var(--col-todo-glow); }
.kanban-column--progress { --col-accent: var(--col-progress); --col-dim: var(--col-progress-dim); --col-glow: var(--col-progress-glow); }
.kanban-column--done { --col-accent: var(--col-done); --col-dim: var(--col-done-dim); --col-glow: var(--col-done-glow); }

.kanban-column--drag-over {
  border-color: var(--col-accent);
  box-shadow: 0 0 20px var(--col-glow), inset 0 0 0 1px color-mix(in srgb, var(--col-accent) 20%, transparent);
  transform: scale(1.01);
}

.kanban-column--drag-over::before {
  opacity: 1;
  height: 2px;
}

/* Header */
.column-header { padding-bottom: var(--space-3); }

.column-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.column-icon {
  font-size: 1.1rem;
  color: var(--col-accent);
  line-height: 1;
}

.column-title {
  font-family: var(--font-display);
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: 0.04em;
  flex: 1;
  text-transform: uppercase;
}

.column-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 var(--space-2);
  border-radius: var(--radius-full);
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  border: 1px solid transparent;
}
.column-count--todo { background: var(--col-todo-dim); color: var(--col-todo); border-color: rgba(255, 209, 102, 0.2); }
.column-count--progress { background: var(--col-progress-dim); color: var(--col-progress); border-color: rgba(167, 139, 250, 0.2); }
.column-count--done { background: var(--col-done-dim); color: var(--col-done); border-color: rgba(86, 207, 178, 0.2); }

.column-accent-line {
  display: none; /* Removed in favor of glowing top border */
}

/* Task list — SortableJS is bound here directly */
.task-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);       /* gap between cards */
  min-height: 80px;
  border-radius: var(--radius-lg);
  transition: background var(--transition-default);
}

.task-list--empty {
  background: repeating-linear-gradient(
    -45deg,
    transparent,
    transparent 8px,
    rgba(255,255,255,0.015) 8px,
    rgba(255,255,255,0.015) 16px
  );
  border: 1.5px dashed var(--border-subtle);
}

/* Empty state */
.empty-state {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-8);
  color: var(--text-muted);
  pointer-events: none;
}
.task-list--empty .empty-state {
  display: flex;
}
.empty-state__icon {
  opacity: 0.4;
  animation: float 4s ease-in-out infinite;
}
.empty-state__text {
  font-size: 0.85rem;
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* Count transition */
.count-enter-active, .count-leave-active { transition: all 0.2s ease; }
.count-enter-from { transform: translateY(-6px) scale(0.8); opacity: 0; }
.count-leave-to { transform: translateY(6px) scale(0.8); opacity: 0; }
</style>
