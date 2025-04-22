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
}, { _id: true }); //

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: String,
  endDate: String,
  people: [
    {
      id: String, // store the _id as string
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
