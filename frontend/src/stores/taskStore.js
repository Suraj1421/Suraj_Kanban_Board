import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { taskApi } from '@/composables/useApi'

/**
 * useTaskStore - Pinia store managing all task state.
 *
 * Why Pinia here? The drag-and-drop logic requires multiple components
 * (3 columns + header) to reactively share the same task list and counts.
 * A centralized store avoids prop-drilling and makes state mutations explicit.
 */
export const useTaskStore = defineStore('tasks', () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const tasks = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // ─── Computed ─────────────────────────────────────────────────────────────
  /** Returns tasks filtered by column status */
  const todoTasks = computed(() => tasks.value.filter((t) => t.status === 'todo'))
  const inProgressTasks = computed(() => tasks.value.filter((t) => t.status === 'inprogress'))
  const doneTasks = computed(() => tasks.value.filter((t) => t.status === 'done'))

  /** Real-time column counts used in column headers */
  const counts = computed(() => ({
    todo: todoTasks.value.length,
    inprogress: inProgressTasks.value.length,
    done: doneTasks.value.length
  }))

  const totalTasks = computed(() => tasks.value.length)

  // ─── Actions ──────────────────────────────────────────────────────────────

  /** Load all tasks from the API on mount */
  async function fetchTasks() {
    isLoading.value = true
    error.value = null
    try {
      tasks.value = await taskApi.getAll()
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Optimistically update task status on drag-drop.
   * We update local state immediately for snappy UX, then sync with DB.
   * If the DB call fails, we revert to the previous state.
   */
  async function moveTask(taskId, newStatus) {
    const task = tasks.value.find((t) => t._id === taskId)
    if (!task || task.status === newStatus) return

    const previousStatus = task.status
    // Optimistic update
    task.status = newStatus

    try {
      await taskApi.updateStatus(taskId, { status: newStatus })
    } catch (err) {
      // Revert on failure
      task.status = previousStatus
      error.value = `Failed to move task: ${err.message}`
    }
  }

  /** Create a new task and add to local state */
  async function createTask(payload) {
    try {
      const newTask = await taskApi.create(payload)
      tasks.value.unshift(newTask) // prepend for instant visibility
      return newTask
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  /** Delete a task with optimistic removal */
  async function deleteTask(taskId) {
    const index = tasks.value.findIndex((t) => t._id === taskId)
    if (index === -1) return

    const [removed] = tasks.value.splice(index, 1)
    try {
      await taskApi.remove(taskId)
    } catch (err) {
      tasks.value.splice(index, 0, removed) // revert
      error.value = err.message
    }
  }

  /** Update task fields (title, description, priority) */
  async function updateTask(taskId, updates) {
    const task = tasks.value.find((t) => t._id === taskId)
    if (!task) return

    const snapshot = { ...task }
    Object.assign(task, updates)

    try {
      await taskApi.updateStatus(taskId, updates)
    } catch (err) {
      Object.assign(task, snapshot)
      error.value = err.message
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    tasks,
    isLoading,
    error,
    todoTasks,
    inProgressTasks,
    doneTasks,
    counts,
    totalTasks,
    fetchTasks,
    moveTask,
    createTask,
    deleteTask,
    updateTask,
    clearError
  }
})
