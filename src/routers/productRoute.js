//Imports
const Product = require('../models/product')
const auth = require('../middleware/auth')
const miniauth = require('../middleware/miniauth')
const express = require('express')
const router = express.Router()

//Creating a product
router.post('/product/create', auth, async (req, res) => {
    try{
        const product = await new Product({...req.body, owner: req.user._id})
        await product.save()
        res.redirect('/my/products')
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//Products created by user
router.get('/my/products', miniauth, async (req, res) => {
    if(req.user !== null && req.user !== undefined && req.user !== false){
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

//Product view
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

//Editing one product
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

router.get('/products/search/category', miniauth, async (req, res) => {
    try{
        if(req.user !== false){
            const products = await Product.find({category: req.query.category})
            res.render('index', {
                author: 'Andrey Raychev',
                username: req.user.username,
                products
            })
        }else {
            const products = await Product.find({category: req.body.category})
            res.render('index', {
                author: 'Andrey Raychev',
                products
            })
        }
    } catch (e) {
        res.status(400).send(e.message)
    }
    
})

//Updating onde product
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

//Deleting the product
router.get('/product/delete/:id', auth, async (req, res) => {
    const product = await Product.findById(req.params.id)
    await product.remove()
    res.redirect(req.get('referer'))
})

//Export modules
module.exports = router