//Imports
const mongoose = require('mongoose')

//Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    buyers: [{
        buyer:{
            type: String,
            trim: true,
        },
        quantity:{
            type: Number,
            trim: true
        },
        price: {
            type: Number,
            trim: true,
            default: this.price
        }
    }],
})

//Creating a model
const Product = mongoose.model('Product', productSchema)

//Export modules
module.exports = Product