import axios from 'axios'

// Base axios instance - all API calls go through here
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

// Response interceptor for consistent error shape
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

export const taskApi = {
  /**
   * Fetch all tasks from the database
   */
  getAll: () => api.get('/tasks'),

  /**
   * Create a new task
   * @param {Object} payload - { title, description, status, priority }
   */
  create: (payload) => api.post('/tasks', payload),

  /**
   * PATCH a task's status (or any partial update)
   * @param {string} id - MongoDB ObjectId
   * @param {Object} updates - Fields to update (e.g. { status: 'done' })
   */
  updateStatus: (id, updates) => api.patch(`/tasks/${id}`, updates),

  /**
   * Delete a task permanently
   * @param {string} id - MongoDB ObjectId
   */
  remove: (id) => api.delete(`/tasks/${id}`)
}
