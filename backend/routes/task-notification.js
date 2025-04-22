const express = require('express');
const Project = require('../models/Project');
const router = express.Router();
const transporter = require('../emailService');

// Helper: normalize to UTC midnight
const getUTCMidnight = (d) => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

// POST /api/send-task-reminders
router.post('/send-task-reminders', async (req, res) => {
  try {
    const { projectId } = req.body;

    console.log('Checking project', projectId, 'for task reminders...');

    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found.');
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.tasks || project.tasks.length === 0) {
      console.log('No tasks in this project.');
      return res.status(200).json({ message: 'No tasks in this project' });
    }

    const today = getUTCMidnight(new Date());
    const emailedUsers = new Set();

    const tasksToNotify = project.tasks.filter(task => {
      const taskDeadline = getUTCMidnight(task.deadline);
      const diffInDays = Math.floor((taskDeadline - today) / (1000 * 60 * 60 * 24));
      task._diffInDays = diffInDays; // store in task for later use
      console.log(`Task: ${task.title}, Deadline: ${taskDeadline.toISOString()}, DiffInDays: ${diffInDays}`);
      return true; // send email for all tasks regardless of date
    });

    if (tasksToNotify.length === 0) {
      console.log('No tasks found to notify.');
      return res.status(200).json({ message: 'No tasks to notify' });
    }

    for (const task of tasksToNotify) {
      const assignedUser = project.people.find(p => p.email === task.assignedTo);
      if (assignedUser && !emailedUsers.has(assignedUser.email)) {
        const deadlineDate = getUTCMidnight(task.deadline);
        const diffInDays = task._diffInDays;

        if (diffInDays < 0) {
          console.log(`Task "${task.title}" is overdue by ${Math.abs(diffInDays)} day(s). Sending reminder to ${assignedUser.email}...`);
        } else if (diffInDays === 0) {
          console.log(`Task "${task.title}" is due today. Sending reminder to ${assignedUser.email}...`);
        } else {
          console.log(`Task "${task.title}" is due in ${diffInDays} day(s). Sending reminder to ${assignedUser.email}...`);
        }

        const mailOptions = {
          from: `"Task Management" <${process.env.EMAIL_USER}>`,
          to: assignedUser.email,
          subject: `Reminder: Task "${task.title}" is Due`,
          text: `Hi ${assignedUser.name},\n\nThis is a reminder that the task "${task.title}" is due on ${deadlineDate.toDateString()}.\n\nDescription: ${task.description}`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Reminder email sent to ${assignedUser.email}`);
          emailedUsers.add(assignedUser.email);
        } catch (err) {
          console.error(`Error sending email to ${assignedUser.email}:`, err.message);
        }
      } else if (!assignedUser) {
        console.warn(`No matching user found for assigned email: ${task.assignedTo}`);
      }
    }

    console.log('Finished processing task reminders.');
    res.status(200).json({ message: 'Task reminders processed successfully' });
  } catch (err) {
    console.error('Error in sending task reminders:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;