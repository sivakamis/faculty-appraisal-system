const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Static Front-End Files
app.use(express.static(path.join(__dirname, '../client/dist')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const appraisalRoutes = require('./routes/appraisalRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const userRoutes = require('./routes/userRoutes');

// Import Helmet
const helmet = require('helmet');

app.use(helmet());
app.use('/api/auth', authRoutes);
app.use('/api/appraisal', appraisalRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);

// Centralized Error Handler Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

app.use((req, res, next) => {
    // only handle GET requests using this catch-all
    if (req.method === 'GET') {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
