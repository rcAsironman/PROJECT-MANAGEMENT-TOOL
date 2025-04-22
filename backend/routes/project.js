const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// GET all projects with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const search = req.query.search || '';
    const query = {
      title: { $regex: search, $options: 'i' }
    };
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({ projects, total });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// POST: Create a new project
router.post('/create', async (req, res) => {
  const { title, description, startDate, endDate, people, createdBy } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      startDate,
      endDate,
      people,
      createdBy,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/stats/count', async (req, res) => {
  try {
    const total = await Project.countDocuments();
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project count' });
  }
});



// GET: Get a project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST: Add a task to a project
router.post('/:projectId/tasks', async (req, res) => {
  const { projectId } = req.params;
  const { title, description, assignedTo, deadline } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const newTask = {
      title,
      description,
      assignedTo,
      deadline,
      status: 'todo'
    };

    project.tasks.push(newTask);
    await project.save();

    const createdTask = project.tasks[project.tasks.length - 1];

    res.status(201).json({ message: 'Task added', task: createdTask }); // includes _id
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET: Get all tasks of a project
router.get('/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ tasks: project.tasks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT: Update a task in a project
router.put('/:projectId/tasks/:taskId', async (req, res) => {
  const { projectId, taskId } = req.params;
  const { title, description, deadline, assignedTo, status } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = project.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.title = title || task.title;
    task.description = description || task.description;
    task.deadline = deadline || task.deadline;
    task.assignedTo = assignedTo || task.assignedTo;
    task.status = status || task.status;

    await project.save();

    res.status(200).json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/:projectId/people', async (req, res) => {
  const { projectId } = req.params;
  const { person } = req.body; // person: { id, name, email, role }

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.people.push(person);
    await project.save();

    res.status(200).json({ message: 'Person added', people: project.people });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET: Get all users assigned to a project
router.get('/:projectId/people', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ people: project.people });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:projectId/people/:personId', async (req, res) => {
  const { projectId, personId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Ensure personId is treated as a string to match the frontend
    project.people = project.people.filter(p => p.id !== personId); // Compare as string

    await project.save();

    res.status(200).json({ message: 'Person removed', people: project.people });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
