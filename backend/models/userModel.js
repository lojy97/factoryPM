const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Phone: { type: String },
    Address: { type: String },
    Orders: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
            orderedAt: { type: Date, default: Date.now },
        },
    ],
});

module.exports = mongoose.model('User', userSchema);