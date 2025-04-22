const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [
      'Developer', 'Designer', 'Project Manager', 'Tester', 'Product Owner',
      'Scrum Master', 'DevOps Engineer', 'UI/UX Designer', 'Frontend Engineer',
      'Backend Engineer', 'Mobile Developer', 'Data Scientist', 'Business Analyst',
      'Security Analyst', 'Technical Writer', 'QA Engineer', 'CTO', 'CEO', 'COO',
      'Admin'
    ],
    default: 'Developer'
  },
  otpCode: {
    type: String,
    default: null,
  },
  otpExpires: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
