<template>
  <div class="kanban-board" role="region" aria-label="Task board">
    <div class="board-columns">
      <KanbanColumn
        v-for="col in columns"
        :key="col.id"
        :column-id="col.id"
        :title="col.title"
        :accent="col.accent"
        :icon="col.icon"
        :tasks="col.tasks"
        @task-moved="handleTaskMoved"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import KanbanColumn from '@/components/KanbanColumn.vue'

const store = useTaskStore()

// Column definitions — single source of truth for column config
const columns = computed(() => [
  {
    id: 'todo',
    title: 'To Do',
    accent: 'todo',
    icon: '◈',
    tasks: store.todoTasks
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    accent: 'progress',
    icon: '◎',
    tasks: store.inProgressTasks
  },
  {
    id: 'done',
    title: 'Done',
    accent: 'done',
    icon: '◉',
    tasks: store.doneTasks
  }
])

/**
 * Called by KanbanColumn when a card is dropped into it.
 * @param {{ taskId: string, newStatus: string }} payload
 */
async function handleTaskMoved({ taskId, newStatus }) {
  await store.moveTask(taskId, newStatus)
}
</script>

<style scoped>
.kanban-board {
  max-width: 1400px;
  margin: 0 auto;
}

.board-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  align-items: start;
}

@media (max-width: 900px) {
  .board-columns {
    grid-template-columns: 1fr;
    max-width: 540px;
    margin: 0 auto;
  }
}
</style>
