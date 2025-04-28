const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = require('./productsModel').Schema; 

const shopSchema = new Schema({
    name: { type: String, required: true },
    logo: { type: String, required: true }, 
    products: [productSchema],
    password: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model('Shop', shopSchema);
