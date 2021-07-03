const express = require('express')
const miniauth = require('../middleware/miniauth')
const auth = require('../middleware/auth')
const Product = require('../models/product')
const router = express.Router()

router.get('/cart',miniauth, async (req, res) => {
    if(req.user !== null){
        await req.user.populate({
            path: 'cart'
        }).execPopulate()
        const products = req.user.cart
        res.render('cart', {
            author: 'Andrey Raychev',
            username: req.user.username,
            products
        })
    }else{
        res.render('cart', {
            author: 'Andrey Raychev'
        })
    }
})

router.get('/cart/delete/:id', auth, async(req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        product.buyer = undefined
        await product.save()
        res.redirect('/cart')
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router