const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Id: { type: Number, required: true, unique: true },
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Role: { 
        type: String, 
        required: true, 
        enum: ['admin', 'user'] 
    }
});

module.exports = mongoose.model('users', userSchema);
module.exports.Schema = userSchema; 
