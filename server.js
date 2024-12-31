const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection (placeholder - replace with actual connection string)
mongoose.connect('mongodb://localhost:27017/uno_ghamasaan', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
    console.log('Failed to connect to MongoDB. Please ensure MongoDB is running.');
    console.log('Error:', err.message);
});

// Serve static files from the public directory
const staticPath = path.join(__dirname, 'public');
console.log('Serving static files from:', staticPath);
app.use('/static', express.static(staticPath));

// Import routes
const gameRoutes = require('./routes/gameRoutes');

// Route for serving index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.use('/api/games', gameRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
