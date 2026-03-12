const mongoose = require('mongoose');

/**
 * Task Schema
 * Stores each kanban card with title, description, status, and timestamps.
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'inprogress', 'done'],
        message: 'Status must be one of: todo, inprogress, done'
      },
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Task', taskSchema);
