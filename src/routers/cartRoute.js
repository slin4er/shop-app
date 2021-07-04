const express = require('express')
const miniauth = require('../middleware/miniauth')
const auth = require('../middleware/auth')
const Product = require('../models/product')
const router = express.Router()

router.get('/cart',miniauth, async (req, res) => {
    if(req.user !== null){
        const productos = await Product.find({})
        const products = await productos.filter((product) => product.buyers.includes(req.user.username))
        if(products){
            res.render('cart', {
                author: 'Andrey Raychev',
                username: req.user.username,
                products
            })
        } else {
            res.render('cart', {
                author: 'Andrey Raychev',
                username: req.user.username,
            })
        }
    }else{
        res.render('cart', {
            author: 'Andrey Raychev'
        })
    }
})

router.get('/cart/add/:id', auth, async (req, res) =>{
    try{
        const product = await Product.findById(req.params.id)
        if (product.buyers.includes(req.user.username))
        {
            return res.redirect(req.get('referer'))
        }
        await product.updateOne({$push: {buyers: req.user.username}})
        await product.save()
        res.redirect(req.get('referer'))
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/cart/delete/:id', auth, async(req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        product.buyers = await product.buyers.filter((buyer) => buyer !== req.user.username)
        await product.save()
        res.redirect('/cart')
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router