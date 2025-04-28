console.log('Connecting to Mongo URI:', process.env.MONGO_URI);
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
connectDB(); // connect to MongoDB Atlas

app.use(express.json());

//ROUTES
// console.log('User routes loaded');
app.use('/api/users', require('./Routes/userRoutes'));

// console.log('Admin routes loaded');
app.use('/api/admins', require('./Routes/adminRoutes'));

 // console.log('Product routes loaded');
app.use('/api/products', require('./Routes/productRoutes')); // Updated route to '/api/products'

// console.log('Shop routes loaded');
app.use('/api/shops', require('./Routes/shopRoutes')); // Updated route to '/api/shops'
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});