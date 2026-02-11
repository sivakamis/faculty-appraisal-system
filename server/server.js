const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Faculty Appraisal System API Running');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const appraisalRoutes = require('./routes/appraisalRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/appraisal', appraisalRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
