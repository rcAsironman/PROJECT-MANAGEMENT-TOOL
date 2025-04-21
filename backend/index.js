// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const User = require('./models/User');
const projectRoutes = require('./routes/project');
const userRoutes = require('./routes/users');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', authRoutes); // ADD THIS below middleware
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(async () => {
        console.log('MongoDB connected')

        // Check for root user and create if missing
        const rootEmail = process.env.EMAIL_USER;
        const rootPassword = process.env.ROOT_PASSWORD;
        const rootName = process.env.ROOT_NAME || 'Root User';

        const existingRoot = await User.findOne({ email: rootEmail });
        if (!existingRoot) {
            const rootUser = new User({
                name: rootName,
                email: rootEmail,
                password: rootPassword
            });
            await rootUser.save();
            console.log('Root user created');
        } else {
            console.log('Root user already exists');
        }

    })
    .catch((err) => console.error('MongoDB connection error:', err));

// Register Route
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
