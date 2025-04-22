const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search || '';

  try {
    const total = await User.countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ]
    });

    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ]
    }, 'name email role')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 });

    res.status(200).json({
      users,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


router.get('/stats/count', async (req, res) => {
  try {
    const total = await User.countDocuments();
    res.status(200).json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user count' });
  }
});


// DELETE a user (only Admins or Root can delete)
router.delete('/:id', async (req, res) => {
  const userRole = req.headers['x-user-role']; // Assuming you pass role from frontend

  if (userRole !== 'Admin' && userRole !== 'Root') {
    return res.status(403).json({ message: 'Not authorized to delete users' });
  }

  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update a user (only Admins or Root)
router.put('/:id', async (req, res) => {
  const userRole = req.headers['x-user-role'];

  if (userRole !== 'Admin' && userRole !== 'Root') {
    return res.status(403).json({ message: 'Not authorized to update users' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body, // name, email, role, etc.
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'name email role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
