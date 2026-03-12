const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// ─── GET /api/tasks ───────────────────────────────────────────────────────────
// Fetch all tasks, sorted by status and order
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ status: 1, order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
  }
});

// ─── POST /api/tasks ──────────────────────────────────────────────────────────
// Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || '',
      status: status || 'todo',
      priority: priority || 'medium'
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: err.message });
    }
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
});

// ─── PATCH /api/tasks/:id ─────────────────────────────────────────────────────
// Update task status (core requirement) + optional other fields
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = ['status', 'title', 'description', 'priority', 'order'];
    const updates = {};

    // Only extract allowed fields from body to prevent mass-assignment
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true } // return updated doc, run schema validators
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Validation failed', details: err.message });
    }
    res.status(500).json({ error: 'Failed to update task', details: err.message });
  }
});

// ─── DELETE /api/tasks/:id ────────────────────────────────────────────────────
// Delete a task by ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    res.status(500).json({ error: 'Failed to delete task', details: err.message });
  }
});

module.exports = router;
