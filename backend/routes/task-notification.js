const express = require('express');
const Project = require('../models/Project');
const router = express.Router();
const transporter = require('../emailService');

// Normalize to UTC midnight
const getUTCMidnight = (d) => {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

router.post('/send-task-reminders', async (req, res) => {
  try {
    const { projectId } = req.body;

    console.log(`Received request for task reminders for project: ${projectId}`);

    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found.');
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log(`Fetched project: ${project.title} with ${project.tasks.length} tasks.`);

    if (!project.tasks || project.tasks.length === 0) {
      console.log('No tasks in this project.');
      return res.status(200).json({ message: 'No tasks in this project' });
    }

    const today = getUTCMidnight(new Date());

    const tasksToNotify = project.tasks.filter(task => {
      if (!task.deadline) {
        console.log(`Skipping task "${task.title}" as it has no deadline.`);
        return false;
      }

      if (task.status !== 'todo' && task.status !== 'inprogress') {
        console.log(`Skipping task "${task.title}" because status is "${task.status}".`);
        return false;
      }

      const taskDeadline = getUTCMidnight(task.deadline);
      const diffInDays = Math.floor((taskDeadline - today) / (1000 * 60 * 60 * 24));
      task._diffInDays = diffInDays;

      console.log(`Task: "${task.title}", Status: ${task.status}, Deadline: ${task.deadline}, DiffInDays: ${diffInDays}`);

      return diffInDays <= 2 && diffInDays >= 0 || diffInDays < 0;
    });

    if (tasksToNotify.length === 0) {
      console.log('No tasks found to notify.');
      return res.status(200).json({ message: 'No tasks to notify' });
    }

    console.log(`Found ${tasksToNotify.length} tasks due soon or overdue.`);

    for (const task of tasksToNotify) {
      const assignedUser = project.people.find(p => p.email === task.assignedTo);

      if (assignedUser) {
        const deadlineDate = getUTCMidnight(task.deadline);
        const diffInDays = task._diffInDays;

        let emailSubject = `Reminder: Task "${task.title}" is Due`;
        let emailBody = `Hi ${assignedUser.name},\n\nThis is a reminder that the task "${task.title}" is due on ${deadlineDate.toDateString()}.\n\nDescription: ${task.description}`;

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
          subject: emailSubject,
          text: emailBody,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Reminder email sent to ${assignedUser.email} for task "${task.title}"`);
        } catch (err) {
          console.error(`Error sending email to ${assignedUser.email} for task "${task.title}":`, err.message);
        }

      } else {
        console.warn(`No matching user found for assigned email: ${task.assignedTo}`);
      }
    }

    console.log('Finished processing task reminders.');
    return res.status(200).json({ message: 'Task reminders processed successfully' });

  } catch (err) {
    console.error('Error in sending task reminders:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

module.exports = router;