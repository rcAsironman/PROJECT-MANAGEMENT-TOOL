// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const transporter = require("../emailService")
console.log("Transporter imported successfully");

const verificationCodes = {};

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body; // include role

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newUser = new User({ name, email, password, role }); // include role in newUser
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password.' });
    }

    // Return full user object (excluding sensitive data like OTP)
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

  

  
  // Send OTP
  router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins
  
      user.otpCode = otp;
      user.otpExpires = otpExpires;
      await user.save();  
      await transporter.sendMail({
        from: `"Project Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
      });
  
      res.json({ message: 'OTP sent to email' });
    } catch (err) {
        console.error('Send OTP Error:', err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  // Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      if (user.otpCode !== otp || new Date() > new Date(user.otpExpires)) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
  
      res.json({ message: 'OTP verified' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
  // Reset Password
router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      user.password = newPassword;
      user.otpCode = undefined;
      user.otpExpires = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  


  
module.exports = router;
