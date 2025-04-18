console.log('Connecting to Mongo URI:', process.env.MONGO_URI);
const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();



const app = express();
connectDB(); // connect to MongoDB Atlas

app.use(express.json());

// Optionally add routes here
// app.use('/api/users', require('./routes/user.routes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
