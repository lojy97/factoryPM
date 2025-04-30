const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    Description : {type: String,required: true},
    ProductName : {type: String,required: true},
    url : {type: String,required: true},
    Price : {type: Number,required: true},

})

module.exports = mongoose.model('Product', productSchema);
module.exports.Schema = productSchema; 