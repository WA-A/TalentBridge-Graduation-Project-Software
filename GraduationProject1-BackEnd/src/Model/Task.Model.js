const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
    trim: true,
  },
  Description: {
    type: String,
    required: false,
    trim: true,
  },
  AssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  TaskRoleName: {
    type: String,
    required: true,
  },
  TaskStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending',
  },
  Priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  },
  DueDate: {
    type: Date,
    required: false,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, {
  timestamps: true, 
});

const TaskModel = model('Task',TaskSchema); 
export default TaskModel;
