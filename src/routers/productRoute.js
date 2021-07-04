const Product = require('../models/product')
const auth = require('../middleware/auth')
const miniauth = require('../middleware/miniauth')
const express = require('express')
const router = express.Router()

router.post('/product/create', auth, async (req, res) => {
    try{
        const product = await new Product({...req.body, owner: req.user._id})
        await product.save()
        res.redirect('/my/products')
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/my/products', miniauth, async (req, res) => {
    if(req.user !== null){
        await req.user.populate({
            path: 'products'
        }).execPopulate()
        const products = req.user.products
        const form = false
        res.render('sells',{
            username: req.user.username,
            form,
            products,
            author:'Andrey Raychev'
        })
    }else{
        res.render('sells', {
            author: 'Andrey Raychev'
        })
    }
})

router.get('/product/sell', auth, async (req, res) => {
    try{
        const form = true
        res.render('sells',{
        username: req.user.username,
        form,
        author: "Andrey Raychev"
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/product/view/:id', miniauth, async (req, res) => {
    try{
        if(req.user !== null){
            const product = await Product.findById(req.params.id)
            if(product){
                return res.render('productview', {
                  username: req.user.username,
                  product,
                  author: 'Andrey Raychev'
                })
            }
        } else {
            const product = await Product.findById(req.params.id)
            if (product) {
                res.render('productview', {
                    author: 'Andrey Raychev',
                    product
                })
            }
        }
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/product/edit/:id', auth, async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('edit_product', {
        username: req.user.username,
        name: product.name,
        description: product.description,
        price: product.price,
        _id: product._id,
        author: 'Andrey Raychev'
    })
})

router.post('/product/update/:id', auth, async (req, res) => {
    try{
        const product = await Product.findById(req.params.id)
        await product.updateOne({...req.body, owner: req.user._id})
        await product.save()
        res.redirect('/my/products')
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/product/delete/:id', auth, async (req, res) => {
    const product = await Product.findById(req.params.id)
    await product.remove()
    res.redirect(req.get('referer'))
})

module.exports = router