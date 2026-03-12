require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

const seedTasks = [
  {
    title: 'Grocery Shopping',
    description: 'Buy milk, eggs, bread, and fresh fruit for the week.',
    status: 'done',
    priority: 'high'
  },
  {
    title: 'Pay Electricity Bill',
    description: 'Pay the monthly electricity bill online before the due date.',
    status: 'done',
    priority: 'high'
  },
  {
    title: 'Clean the House',
    description: 'Vacuum the living room, mop floors, and wipe down kitchen counters.',
    status: 'inprogress',
    priority: 'high'
  },
  {
    title: 'Read a Book',
    description: 'Read at least 50 pages of the new sci-fi novel.',
    status: 'inprogress',
    priority: 'medium'
  },
  {
    title: 'Workout Session',
    description: 'Go to the gym for a 45-minute strength training workout.',
    status: 'todo',
    priority: 'medium'
  },
  {
    title: 'Meal Prep',
    description: 'Prepare lunches for Monday to Wednesday to save time.',
    status: 'todo',
    priority: 'low'
  },
  {
    title: 'Call Parents',
    description: 'Catch up with mom and dad over a video call this weekend.',
    status: 'todo',
    priority: 'low'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban_board');
    console.log('✅ Connected to MongoDB');

    await Task.deleteMany({});
    console.log('🗑️  Cleared existing tasks');

    await Task.insertMany(seedTasks);
    console.log(`🌱 Seeded ${seedTasks.length} tasks`);

    await mongoose.disconnect();
    console.log('✅ Done!');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
