<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="$emit('close')" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal" :class="{ 'modal--loading': isSubmitting }">

        <!-- Header -->
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title">New Task</h2>
          <button class="modal-close" @click="$emit('close')" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
              <line x1="2" y1="2" x2="14" y2="14"/>
              <line x1="14" y1="2" x2="2" y2="14"/>
            </svg>
          </button>
        </div>

        <!-- Form (no <form> tag per requirements — using div + button handlers) -->
        <div class="modal-body">

          <!-- Title -->
          <div class="field">
            <label class="field-label" for="task-title">Title <span class="required" aria-hidden="true">*</span></label>
            <input
              id="task-title"
              ref="titleRef"
              v-model="form.title"
              type="text"
              class="field-input"
              :class="{ 'field-input--error': errors.title }"
              placeholder="What needs to be done?"
              maxlength="100"
              @keydown.enter="submitTask"
            />
            <span v-if="errors.title" class="field-error" role="alert">{{ errors.title }}</span>
            <span class="field-count">{{ form.title.length }}/100</span>
          </div>

          <!-- Description -->
          <div class="field">
            <label class="field-label" for="task-desc">Description</label>
            <textarea
              id="task-desc"
              v-model="form.description"
              class="field-input field-textarea"
              placeholder="Add more context…"
              rows="3"
              maxlength="500"
            ></textarea>
            <span class="field-count">{{ form.description.length }}/500</span>
          </div>

          <!-- Row: Status + Priority -->
          <div class="field-row">
            <div class="field">
              <label class="field-label">Status</label>
              <div class="select-group">
                <button
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  class="select-btn"
                  :class="[`select-btn--${opt.accent}`, { active: form.status === opt.value }]"
                  @click="form.status = opt.value"
                  :aria-pressed="form.status === opt.value"
                >{{ opt.label }}</button>
              </div>
            </div>

            <div class="field">
              <label class="field-label">Priority</label>
              <div class="select-group">
                <button
                  v-for="opt in priorityOptions"
                  :key="opt.value"
                  class="select-btn"
                  :class="[`select-btn--priority-${opt.value}`, { active: form.priority === opt.value }]"
                  @click="form.priority = opt.value"
                  :aria-pressed="form.priority === opt.value"
                >{{ opt.label }}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="btn btn--ghost" @click="$emit('close')">Cancel</button>
          <button
            class="btn btn--primary"
            @click="submitTask"
            :disabled="isSubmitting"
            :aria-busy="isSubmitting"
          >
            <span v-if="isSubmitting" class="btn-spinner" aria-hidden="true"></span>
            {{ isSubmitting ? 'Creating…' : 'Create Task' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, onUnmounted } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const emit = defineEmits(['close'])
const store = useTaskStore()
const titleRef = ref(null)
const isSubmitting = ref(false)

const form = reactive({
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium'
})

const errors = reactive({ title: '' })

const statusOptions = [
  { value: 'todo', label: 'To Do', accent: 'todo' },
  { value: 'inprogress', label: 'In Progress', accent: 'progress' },
  { value: 'done', label: 'Done', accent: 'done' }
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Med' },
  { value: 'high', label: 'High' }
]

onMounted(async () => {
  await nextTick()
  titleRef.value?.focus()
  // Close on Escape key
  window.addEventListener('keydown', handleKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKey)
})

function handleKey(e) {
  if (e.key === 'Escape') emit('close')
}

function validate() {
  errors.title = ''
  if (!form.title.trim()) {
    errors.title = 'Title is required.'
    return false
  }
  return true
}

async function submitTask() {
  if (!validate() || isSubmitting.value) return
  isSubmitting.value = true
  try {
    await store.createTask({ ...form, title: form.title.trim() })
    emit('close')
  } catch {
    errors.title = 'Failed to create task. Try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(11, 15, 25, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: fadeInScale 0.2s ease both;
}

.modal {
  width: 100%;
  max-width: 520px;
  background: rgba(17, 17, 24, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(167, 139, 250, 0.2);
  border-radius: var(--radius-xl);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  overflow: hidden;
  animation: slideDown 0.25s ease both;
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
}
.modal-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--radius-sm);
  display: flex;
  transition: color var(--transition-fast), background var(--transition-fast);
}
.modal-close:hover { color: var(--text-primary); background: var(--bg-elevated); }

/* Body */
.modal-body {
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.field { display: flex; flex-direction: column; gap: var(--space-2); position: relative; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }

.field-label {
  font-size: 0.78rem;
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.required { color: var(--priority-high); }

.field-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.92rem;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast), background var(--transition-fast);
  width: 100%;
  resize: none;
}
.field-input::placeholder { color: var(--text-muted); }
.field-input:focus {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--col-progress);
  box-shadow: 0 0 0 1px var(--col-progress) inset, 0 0 12px rgba(167, 139, 250, 0.2);
}
.field-input--error {
  border-color: var(--priority-high);
  box-shadow: 0 0 0 1px var(--priority-high) inset, 0 0 12px rgba(255, 107, 107, 0.2);
}
.field-textarea { min-height: 80px; }

.field-error {
  font-size: 0.78rem;
  color: var(--priority-high);
}
.field-count {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-align: right;
  margin-top: -4px;
}

/* Select buttons */
.select-group { display: flex; gap: var(--space-2); flex-wrap: wrap; }
.select-btn {
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-default);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-family: var(--font-display);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.select-btn:hover { border-color: var(--border-strong); color: var(--text-primary); }

.select-btn--todo.active { background: var(--col-todo-dim); border-color: var(--col-todo); color: var(--col-todo); }
.select-btn--progress.active { background: var(--col-progress-dim); border-color: var(--col-progress); color: var(--col-progress); }
.select-btn--done.active { background: var(--col-done-dim); border-color: var(--col-done); color: var(--col-done); }
.select-btn--priority-low.active { background: rgba(86,207,178,0.1); border-color: var(--priority-low); color: var(--priority-low); }
.select-btn--priority-medium.active { background: rgba(255,209,102,0.1); border-color: var(--priority-medium); color: var(--priority-medium); }
.select-btn--priority-high.active { background: rgba(255,107,107,0.1); border-color: var(--priority-high); color: var(--priority-high); }

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-subtle);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}
.btn--ghost {
  background: none;
  border-color: var(--border-default);
  color: var(--text-secondary);
}
.btn--ghost:hover { color: var(--text-primary); background: var(--bg-elevated); }
.btn--primary {
  background: rgba(167, 139, 250, 0.15);
  border: 1px solid rgba(167, 139, 250, 0.4);
  color: var(--col-progress);
  box-shadow: 0 4px 16px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(167, 139, 250, 0.1);
}
.btn--primary:hover { 
  transform: translateY(-1px); 
  background: rgba(167, 139, 250, 0.25);
  color: #fff;
  border-color: rgba(167, 139, 250, 0.6);
  box-shadow: 0 6px 24px rgba(167, 139, 250, 0.25); 
}
.btn--primary:disabled { opacity: 0.6; transform: none; cursor: not-allowed; }

.btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
</style>
