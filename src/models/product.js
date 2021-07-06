const mongoose = require('mongoose')

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
        type: String,
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
        }
    }],
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product