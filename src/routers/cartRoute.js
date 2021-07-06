const express = require('express')
const miniauth = require('../middleware/miniauth')
const auth = require('../middleware/auth')
const Product = require('../models/product')
const router = express.Router()

router.get('/cart',miniauth, async (req, res) => {
    if(req.user !== null){
        const products = await Product.find({'buyers.buyer': req.user.username})
        await products.forEach(element => {
            neededBuyer = element.buyers.filter((buyer) => buyer.buyer === req.user.username)
            element.buyers = neededBuyer[0]
        });
        if(products){
            res.render('cart', {
                author: 'Andrey Raychev',
                username: req.user.username,
                products,
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
        existUser = await product.buyers.filter((buyer) => buyer.buyer === req.user.username)
        if(existUser.length > 0) {
            existUser[0].quantity += 1
            await product.save()
            return res.redirect(req.get('referer'))
        }
        product.buyers = await product.buyers.concat({buyer: req.user.username, quantity: 1})
        await product.save()
        res.redirect(req.get('referer'))
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/cart/delete/:id', auth, async(req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        product.buyers = await product.buyers.filter((buyer) => buyer.buyer !== req.user.username)
        await product.save()
        res.redirect('/cart')
    } catch (e) {
        res.status(400).send(e.message)
    }
})

module.exports = router