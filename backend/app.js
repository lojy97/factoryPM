console.log('Connecting to Mongo URI:', process.env.MONGO_URI);
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB(); // connect to MongoDB Atlas

app.use(express.json());

// Optionally add routes here
console.log('User routes loaded');
app.use('/api/users', require('./Routes/userRoutes'));
console.log('Admin routes loaded');
app.use('/api/admins', require('./Routes/adminRoutes')); // Updated route to '/api/admins'
app.use('/api/orders', orderRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});