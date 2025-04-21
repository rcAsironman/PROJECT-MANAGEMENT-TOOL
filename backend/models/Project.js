const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  assignedTo: String,
  deadline: String,
  status: {
    type: String,
    enum: ['todo', 'inprogress', 'completed'],
    default: 'todo',
  },
}, { _id: true }); // ✅ ensure _id is enabled

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: String,
  endDate: String,
  people: [
    {
      id: Number,
      name: String,
      email: String,
      role: String,
    }
  ],
  createdBy: {
    name: String,
    email: String,
  },
  tasks: [taskSchema]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
